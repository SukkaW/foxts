import { isAbortErrorLike } from '../abort-error';
import { extractErrorMessage } from '../extract-error-message';
import { isNetworkError } from '../is-network-error';
import { noop, trueFn } from '../noop';

const { round: MathRound } = Math;
const E = Error;
const TypeE = TypeError;

export interface AsyncRetryContext {
  readonly error: unknown,
  readonly attemptNumber: number,
  readonly retriesLeft: number
}

export interface AsyncRetryOptions {
  /**
    Callback invoked on each retry. Receives a context object containing the error and retry state information.

    The `onFailedAttempt` function can return a promise. For example, to add extra delay, especially useful reading `Retry-After` header.

    If the `onFailedAttempt` function throws, all retries will be aborted and the original promise will reject with the thrown error.
    */
  onFailedAttempt?: (context: AsyncRetryContext) => void | Promise<void>,

  /**
   * @deprecated Use `onFailedAttempt` instead. This is added only to be compatible with `async-retry`
   */
  onRetry?: (error: unknown, attemptNumber: number) => void | Promise<void>,

  /**
    Decide if a retry should occur based on the context. Returning true triggers a retry, false aborts with the error.

    It is only called if `retries` and `maxRetryTime` have not been exhausted.
    It is not called for `TypeError` (except network errors) and `AbortError`.

    In the example above, the operation will be retried unless the error is an instance of `CustomError`.
    */
  shouldRetry?: (context: AsyncRetryContext) => boolean | Promise<boolean>,

  /**
   * @deprecated Use `retries` w/ `Number.POSITIVE_INFINITY` instead
   */
  forever?: boolean,

  /**
    The maximum amount of times to retry the operation.
    @default 10
    */
  retries?: number,

  /**
    The exponential factor to use.
    @default 2
    */
  factor?: number,

  /**
    The number of milliseconds before starting the first retry.
    @default 1000
    */
  minTimeout?: number,

  /**
    The maximum number of milliseconds between two retries.
    @default Infinity
    */
  maxTimeout?: number,

  /**
    Randomizes the timeouts by multiplying with a factor between 1 and 2.
    @default true
    */
  randomize?: boolean,

  /**
    The maximum time (in milliseconds) that the retried operation is allowed to run.
    @default Infinity
    */
  maxRetryTime?: number,

  /**
    You can abort retrying using [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
    */
  signal?: AbortSignal,

  /**
    Prevents retry timeouts from keeping the process alive.
    Only affects platforms with a `.unref()` method on timeouts, such as Node.js.
    @default false
    */
  unref?: boolean
}

interface InternalAsyncRetryOptionsWithDefaults extends
  Pick<Required<AsyncRetryOptions>, 'retries' | 'factor' | 'minTimeout' | 'maxTimeout' | 'randomize' | 'onFailedAttempt' | 'onRetry' | 'shouldRetry'>,
  Omit<AsyncRetryOptions, 'retries' | 'factor' | 'minTimeout' | 'maxTimeout' | 'randomize' | 'onFailedAttempt' | 'onRetry' | 'shouldRetry'> {
}

function validateNumberOption(name: string, value: number, min = 0, allowInfinity = false) {
  if (Number.isNaN(value)) {
    throw new TypeE(`Expected \`${name}\` to be a valid number${allowInfinity ? ' or Infinity' : ''}, got NaN.`);
  }

  if (!allowInfinity && !Number.isFinite(value)) {
    throw new TypeE(`Expected \`${name}\` to be a finite number.`);
  }

  if (value < min) {
    throw new TypeE(`Expected \`${name}\` to be \u2265 ${min}.`);
  }
}

export class AsyncRetryAbortError extends E {
  name = 'AsyncRetryAbortError';
  cause?: unknown;

  constructor(message: string | Error | unknown) {
    let errorMessage = '';
    if (typeof message === 'string') {
      errorMessage = message;
    } else {
      errorMessage = extractErrorMessage(message, false) ?? 'Aborted';
    }

    super(errorMessage);

    if (typeof message === 'string') {
      const cause = new E(message);
      cause.stack = this.stack;
      this.cause = cause;
    } else if (message instanceof E) {
      this.cause = message;
      this.message = message.message;
    } else {
      this.cause = message;
    }
  }
}

async function onAttemptFailure(
  attemptError: unknown,
  attemptNumber: number,
  options: InternalAsyncRetryOptionsWithDefaults,
  startTime: number, maxRetryTime: number
) {
  if (attemptError instanceof AsyncRetryAbortError) {
    throw attemptError.cause;
  }

  if (attemptError instanceof TypeE && !isNetworkError(attemptError)) {
    throw attemptError;
  }

  if (isAbortErrorLike(attemptError)) {
    throw attemptError as Error;
  }

  // Minus 1 from attemptNumber because the first attempt does not count as a retry
  const retriesLeft = options.retries - (attemptNumber - 1);

  const context: AsyncRetryContext = {
    error: attemptError,
    attemptNumber,
    retriesLeft
  };

  await options.onFailedAttempt(context);
  if (attemptNumber > 1) { // onRetry should not be called on the first initial failure
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- implementation
    await options.onRetry(attemptError, attemptNumber - 1); // deprecated
  }

  const currentTime = Date.now();
  if (
    currentTime - startTime >= maxRetryTime
    || attemptNumber >= options.retries + 1
    || !(await options.shouldRetry(context))
  ) {
    throw attemptError; // Do not retry, throw the original error
  }

  // Calculate delay before next attempt
  const random = options.randomize ? (Math.random() + 1) : 1;
  let delayTime = MathRound(random * options.minTimeout * (options.factor ** (attemptNumber - 1)));

  if (delayTime > options.maxTimeout) {
    delayTime = options.maxTimeout;
  }

  // Ensure that delay does not exceed maxRetryTime
  const timeLeft = maxRetryTime - (currentTime - startTime);
  if (timeLeft <= 0) {
    throw attemptError; // Max retry time exceeded
  }

  let finalDelay = delayTime;
  if (delayTime > timeLeft) {
    finalDelay = timeLeft;
  }

  // Introduce delay
  if (finalDelay > 0) {
    await new Promise<void>((resolve, reject) => {
      const timeoutToken = setTimeout(() => {
        options.signal?.removeEventListener('abort', onAbort);
        resolve();
      }, finalDelay);

      function onAbort() {
        clearTimeout(timeoutToken);
        options.signal?.removeEventListener('abort', onAbort);
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- internal abort
        reject(options.signal?.reason);
      };

      if (options.unref && typeof timeoutToken === 'object' && 'unref' in timeoutToken && typeof timeoutToken.unref === 'function') {
        timeoutToken.unref();
      }

      options.signal?.addEventListener('abort', onAbort, { once: true });
    });
  }

  options.signal?.throwIfAborted();
}

function bail(err: unknown): never {
  throw new AsyncRetryAbortError(err ?? 'Aborted');
}

export async function asyncRetry<T>(
  callback: (
    bail: (reason?: unknown) => never,
    attemptNumber: number
  ) => PromiseLike<T> | T,
  retryOptions: AsyncRetryOptions = {}
) {
  retryOptions.signal?.throwIfAborted();

  const options = { ...retryOptions };

  options.retries ??= 10;
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- implementation
  options.forever ??= false;
  options.factor ??= 2;
  options.minTimeout ??= 1000;
  options.maxTimeout ??= Number.POSITIVE_INFINITY;
  options.randomize ??= true;
  options.onFailedAttempt ??= noop;
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- implementation
  options.onRetry ??= noop;
  options.shouldRetry ??= trueFn;

  // eslint-disable-next-line @typescript-eslint/no-deprecated -- implementation
  if (options.forever) {
    options.retries = Number.POSITIVE_INFINITY;
  }

  // Validate numeric options and normalize edge cases
  validateNumberOption('retries', options.retries, 0, true);
  validateNumberOption('factor', options.factor, 0, false);
  validateNumberOption('minTimeout', options.minTimeout, 0, false);
  validateNumberOption('maxTimeout', options.maxTimeout, 0, true);
  const resolvedMaxRetryTime = options.maxRetryTime ?? Number.POSITIVE_INFINITY;
  validateNumberOption('maxRetryTime', resolvedMaxRetryTime, 0, true);

  if (options.minTimeout < 1) {
    options.minTimeout = 1; // // Ensure minTimeout is at least 1ms
  }

  // Treat non-positive factor as 1 to avoid zero backoff or negative behavior
  if (options.factor <= 0) {
    options.factor = 1;
  }

  let attemptNumber = 0;
  const startTime = Date.now();

  // Use validated local value
  const maxRetryTime = resolvedMaxRetryTime;

  while (attemptNumber < options.retries + 1) {
    attemptNumber++;

    try {
      options.signal?.throwIfAborted();

      // eslint-disable-next-line no-await-in-loop -- retry in sequence
      const result = await callback(bail, attemptNumber);

      options.signal?.throwIfAborted();

      return result;
    } catch (error) {
      let e = error;

      // This is to be backward compatible with async-retry, which has a undocumented behavior of error.bail = true
      if (typeof error === 'object' && error && 'bail' in error && error.bail) {
        e = new AsyncRetryAbortError(error);
      }

      // eslint-disable-next-line no-await-in-loop -- retry in sequence
      await onAttemptFailure(e, attemptNumber, options as InternalAsyncRetryOptionsWithDefaults, startTime, maxRetryTime);
    }
  }

  // Should not reach here, but in case it does, throw an error
  throw new E('Retry attempts exhausted without throwing an error.');
}

export function makeRetriable<Args extends unknown[], Result>(
  fn: (...args: Args) => PromiseLike<Result> | Result,
  options?: AsyncRetryOptions
) {
  return function (this: unknown, ...args: Args): Promise<Result> {
    return asyncRetry(() => fn.apply(this, args), options);
  };
}

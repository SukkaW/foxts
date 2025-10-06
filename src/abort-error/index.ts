import { isErrorLikeObject } from '../extract-error-message';
import type { ErrorLikeObject } from '../extract-error-message';

export interface AbortErrorLike extends Omit<ErrorLikeObject, 'name'> {
  name: 'AbortError',
  code?: 'ABORT_ERR'
}

// https://github.com/nodejs/node/blob/0c1fb986a01c492c681bdb145ca5cba3df2dff3d/lib/internal/errors.js#L976-L988
export class AbortError extends Error implements AbortErrorLike {
  public readonly name = 'AbortError';
  public readonly code = 'ABORT_ERR';

  constructor(message = 'The operation was aborted', options?: ErrorOptions) {
    super(message, options);
  }
}

export function isAbortErrorLike(error: unknown): error is AbortErrorLike {
  if (!isErrorLikeObject(error)) {
    return false;
  }
  if (error.name === 'AbortError') {
    return true;
  }
  // eslint-disable-next-line sukka/prefer-single-boolean-return -- readability
  if ('code' in error && typeof error.code === 'string' && error.code === 'ABORT_ERR') {
    return true;
  }
  return false;
}

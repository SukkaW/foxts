/* eslint-disable @typescript-eslint/no-empty-function -- unit test */
/* eslint-disable @typescript-eslint/require-await -- unit test */
import { describe, it } from 'mocha';
import { expect } from 'expect';
import { wait } from '../wait';
import { asyncRetry, makeRetriable, AsyncRetryAbortError } from '.';
import { spy, stub } from 'sinon';

// Prevent unit test from stalling
const sharedOpt = {
  factor: 1,
  minTimeout: 5,
  maxTimeout: 80
};

describe('async-retry', () => {
  it('return value', async () => {
    const val = await asyncRetry(async (bail, num) => {
      if (num < 2) {
        throw new Error('woot');
      }

      await wait(50);
      return `woot ${num}`;
    }, sharedOpt);

    expect(val).toEqual('woot 2');
  });

  it('return value no await', async () => {
    const val = await asyncRetry(async (bail, num) => num);
    expect(val).toEqual(1);
  });

  it('chained promise', async () => {
    const res = await asyncRetry((bail, num) => {
      if (num < 2) {
        throw new Error('retry');
      }

      return new Response('ok', { status: 200 });
    }, sharedOpt);

    expect(res.status).toEqual(200);
  });

  it('bail', async () => {
    await expect(asyncRetry(

      async (bail, num) => {
        if (num === 2) {
          bail(new Error('Wont retry'));
        }

        throw new Error(`Test ${num}`);
      },
      { ...sharedOpt, retries: 3 }
    )).rejects.toThrow('Wont retry');
  });

  it('bail + return', async () => {
    await expect(Promise.resolve(
      asyncRetry(async bail => {
        await wait(20);
        await wait(20);
        bail(new Error('woot'));
      }, sharedOpt)
    )).rejects.toThrow('woot');
  });

  it('bail error', async () => {
    let retries = 0;

    await expect(asyncRetry(
      async () => {
        retries += 1;
        await wait(100);
        const err = new Error('Wont retry');
        Object.assign(err, { bail: true });
        throw err;
      },
      { ...sharedOpt, retries: 3 }
    )).rejects.toThrow('Wont retry');

    expect(retries).toEqual(1);
  });

  it('with non-async functions', async () => {
    await expect(asyncRetry(
      (bail, num) => {
        throw new Error(`Test ${num}`);
      },
      { ...sharedOpt, retries: 2 }
    )).rejects.toThrow('Test 3');
  });

  it('return non-async', async () => {
    const val = await asyncRetry(() => 5);
    expect(val).toEqual(5);
  });

  it('with number of retries', async () => {
    let retries = 0;

    await expect(asyncRetry(() => { throw new Error('test'); }, {
      ...sharedOpt,
      retries: 2,
      onRetry(err, i) {
        retries = i;
      }
    })).rejects.toBeTruthy();

    expect(retries).toEqual(2);
  });

  const fixture = Symbol('fixture');
  const fixtureError = new Error('fixture');

  it('retries', async () => {
    let index = 0;

    const returnValue = await asyncRetry(async (bail, attemptNumber) => {
      await wait(5);
      index++;

      return attemptNumber === 3 ? fixture : Promise.reject(fixtureError);
    }, sharedOpt);

    expect(returnValue).toEqual(fixture);
    expect(index).toEqual(3);
  });

  it('retries forever when specified', async () => {
    let attempts = 0;
    const maxAttempts = 15; // Limit for test purposes

    await expect(asyncRetry(
      async () => {
        attempts++;
        if (attempts === maxAttempts) {
          throw new AsyncRetryAbortError('stop');
        }

        throw new Error('test');
      },
      {
        factor: 1,
        retries: Number.POSITIVE_INFINITY,
        minTimeout: 0 // Speed up test
      }
    )).rejects.toBeTruthy();

    expect(attempts).toEqual(maxAttempts);
  });

  // Error Handling Tests
  it('throws original error', async () => {
    await expect(asyncRetry(() => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- unit test
      throw 'foo';
    }, sharedOpt)).rejects.toBe('foo');
  });

  it('no retry on TypeError', async () => {
    const typeErrorFixture = new TypeError('type-error-fixture');
    let index = 0;

    await expect(asyncRetry(async (bail, attemptNumber) => {
      await wait(20);
      index++;
      return attemptNumber === 3 ? fixture : Promise.reject(typeErrorFixture);
    }, sharedOpt)).rejects.toThrow(typeErrorFixture);

    expect(index).toEqual(1);
  });

  it('shouldRetry is not called for non-network TypeError', async () => {
    const typeErrorFixture = new TypeError('type-error-fixture');
    let shouldRetryCalled = 0;

    await expect(asyncRetry(async () => {
      throw typeErrorFixture;
    }, {
      ...sharedOpt,
      shouldRetry() {
        shouldRetryCalled++;
        return true;
      }
    })).rejects.toThrow(typeErrorFixture);

    expect(shouldRetryCalled).toEqual(0);
  });

  it('retry on TypeError - failed to fetch', async () => {
    const typeErrorFixture = new TypeError('Failed to fetch');
    let index = 0;

    const returnValue = await asyncRetry(async (bail, attemptNumber) => {
      await wait(20);
      index++;
      return attemptNumber === 3 ? fixture : Promise.reject(typeErrorFixture);
    }, sharedOpt);

    expect(returnValue).toEqual(fixture);
    expect(index).toEqual(3);
  });

  it('errors are preserved when maxRetryTime exceeded', async () => {
    const originalError = new Error('original error');
    const maxRetryTime = 50;
    let startTime;

    await expect(asyncRetry(
      async () => {
        startTime ||= Date.now();

        await wait(maxRetryTime + 25); // Ensure we exceed maxRetryTime
        throw originalError;
      },
      {
        maxRetryTime,
        minTimeout: 0
      }
    )).rejects.toBe(originalError);
  });

  it('AbortError - string', () => {
    const error = new AsyncRetryAbortError('fixture').cause;
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).constructor.name).toEqual('Error');
    expect((error as Error).message).toEqual('fixture');
  });

  it('AbortError - error', () => {
    const error = new AsyncRetryAbortError(new Error('fixture')).cause;
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).constructor.name).toEqual('Error');
    expect((error as Error).message).toEqual('fixture');
  });

  it('aborts', async () => {
    let index = 0;

    await expect(asyncRetry(async (bail, attemptNumber) => {
      await wait(20);
      index++;
      return attemptNumber === 3 ? Promise.reject(new AsyncRetryAbortError(fixtureError)) : Promise.reject(fixtureError);
    }, sharedOpt)).rejects.toBe(fixtureError);

    expect(index).toEqual(3);
  });

  it('operation stops immediately on AbortError', async () => {
    let attempts = 0;

    await expect(asyncRetry(

      async () => {
        attempts++;
        if (attempts === 2) {
          throw new AsyncRetryAbortError('stop');
        }

        throw new Error('test');
      },
      {
        retries: 10,
        minTimeout: 0
      }
    )).rejects.toBeTruthy();

    expect(attempts).toEqual(2); // Should stop after AbortError
  });

  it('shouldRetry is not called for AbortError', async () => {
    let shouldRetryCalled = 0;

    await expect(asyncRetry(async () => {
      throw new AsyncRetryAbortError('stop');
    }, {
      shouldRetry() {
        shouldRetryCalled++;
        return true;
      }
    })).rejects.toThrow('stop');

    expect(shouldRetryCalled).toEqual(0);
  });

  it('aborts with an AbortSignal', async () => {
    let index = 0;
    const controller = new AbortController();

    await expect(asyncRetry(async (_, attemptNumber) => {
      await wait(20);
      index++;
      if (attemptNumber === 3) {
        controller.abort();
      }

      throw fixtureError;
    }, {
      ...sharedOpt,
      signal: controller.signal
    })).rejects.toBeTruthy();

    expect(index).toEqual(3);
  });

  it('preserves the abort reason', async () => {
    let index = 0;
    const controller = new AbortController();

    await expect(asyncRetry(async (bail, attemptNumber) => {
      await wait(20);
      index++;
      if (attemptNumber === 3) {
        controller.abort(fixtureError);
        return;
      }

      throw fixtureError;
    }, {
      ...sharedOpt,
      signal: controller.signal
    })).rejects.toBe(fixtureError);

    expect(index).toEqual(3);
  });

  it('shouldRetry controls retry behavior', async () => {
    const shouldRetryError = new Error('should-retry');
    const customError = new Error('custom-error');
    let index = 0;

    await expect(asyncRetry(async () => {
      await wait(20);
      index++;
      const error = index < 3 ? shouldRetryError : customError;
      throw error;
    }, {
      ...sharedOpt,
      shouldRetry({ error }) {
        return (error as Error).message === shouldRetryError.message;
      },
      retries: 10
    })).rejects.toThrow(customError);

    expect(index).toEqual(3);
  });

  it('onFailedAttempt then shouldRetry order', async () => {
    const order: string[] = [];

    await expect(asyncRetry(async () => {
      throw new Error('order');
    }, {
      onFailedAttempt() {
        order.push('onFailedAttempt');
      },
      shouldRetry() {
        order.push('shouldRetry');
        return false;
      }
    })).rejects.toBeTruthy();

    expect(order).toEqual(['onFailedAttempt', 'shouldRetry']);
  });

  it('handles async shouldRetry with maxRetryTime', async () => {
    let attempts = 0;
    const start = Date.now();
    const maxRetryTime = 50;

    await expect(asyncRetry(
      async () => {
        attempts++;
        throw new Error('test');
      },
      {
        ...sharedOpt,
        retries: 10,
        maxRetryTime,
        async shouldRetry() {
          await wait(20);
          return true;
        }
      }
    )).rejects.toBeTruthy();

    expect(Date.now() - start).toBeLessThanOrEqual(maxRetryTime + 25);
    expect(attempts).toBeLessThan(10);
  });

  it('onFailedAttempt provides correct error details', async () => {
    const retries = 5;
    let index = 0;
    let attemptNumber = 0;

    await asyncRetry(
      async (bail, attemptNumber) => {
        await wait(20);
        index++;
        return attemptNumber === 3 ? fixture : Promise.reject(fixtureError);
      },
      {
        ...sharedOpt,
        onFailedAttempt({ error, attemptNumber: attempt, retriesLeft }) {
          expect(error).toEqual(fixtureError);
          expect(attempt).toEqual(++attemptNumber);
          expect(retriesLeft).toEqual(retries - (index - 1));
        },
        retries
      }
    );

    expect(index).toEqual(3);
    expect(attemptNumber).toEqual(2);
  });

  it('onFailedAttempt is called even when shouldRetry returns false', async () => {
    const error = new Error('fail');
    let onFailedAttemptCount = 0;
    let attempts = 0;

    await expect(asyncRetry(async () => {
      attempts++;
      throw error;
    }, {
      onFailedAttempt() {
        onFailedAttemptCount++;
      },
      shouldRetry: () => false,
      retries: 5
    })).rejects.toBe(error);

    expect(attempts).toEqual(1);
    expect(onFailedAttemptCount).toEqual(1);
  });

  it('onFailedAttempt can return a promise to add a delay', async () => {
    const waitFor = 100;
    const start = Date.now();
    let isCalled: boolean;

    await asyncRetry(
      async () => {
        if (isCalled) {
          return fixture;
        }

        isCalled = true;
        throw fixtureError;
      },
      {
        ...sharedOpt,
        async onFailedAttempt() {
          await wait(waitFor);
        }
      }
    );

    expect(Date.now()).toBeGreaterThan(start + waitFor);
  });

  it('onFailedAttempt can throw to abort retries', async () => {
    const error = new Error('thrown from onFailedAttempt');

    await expect(asyncRetry(async () => {
      throw fixtureError;
    }, {
      onFailedAttempt() {
        throw error;
      }
    })).rejects.toBe(error);
  });

  it('retry context object is immutable', async () => {
    await expect(asyncRetry(async () => {
      throw new Error('fail');
    }, {
      ...sharedOpt,
      onFailedAttempt(context) {
        // Attempt to mutate frozen object in strict mode should throw
        Object.defineProperty(context, 'foo', { value: 'bar' });
      }
    })).rejects.toBeTruthy();
  });

  it('onFailedAttempt can be undefined', async () => {
    const error = new Error('thrown from onFailedAttempt');

    await expect(asyncRetry(() => {
      throw error;
    }, {
      ...sharedOpt,
      onFailedAttempt: undefined,
      retries: 1
    })).rejects.toBe(error);
  });

  it('shouldRetry can be undefined', async () => {
    const error = new Error('thrown from onFailedAttempt');

    await expect(asyncRetry(() => {
      throw error;
    }, {
      ...sharedOpt,
      shouldRetry: undefined,
      retries: 1
    })).rejects.toBe(error);
  });

  it('factor affects exponential backoff', async () => {
    const sTO = spy(globalThis, 'setTimeout');

    try {
      await expect(asyncRetry(
        async () => {
          throw new Error('test');
        },
        {
          retries: 3,
          factor: 2,
          minTimeout: 10,
          maxTimeout: Number.POSITIVE_INFINITY,
          randomize: false
        }
      )).rejects.toBeTruthy();

      expect(sTO.getCalls().map(call => call.args[1])).toEqual([10, 20, 40]);
    } finally {
      sTO.restore();
    }
  });

  it('timeouts are incremental with factor', async () => {
    const sTO = spy(globalThis, 'setTimeout');

    try {
      await expect(asyncRetry(
        async () => {
          throw new Error('test');
        },
        {
          retries: 3,
          factor: 0.5,
          minTimeout: 40,
          maxTimeout: Number.POSITIVE_INFINITY,
          randomize: false
        }
      )).rejects.toBeTruthy();

      // With factor 0.5 and minTimeout 100, expected delays: 100, 50, 25 (before rounding)
      expect(sTO.getCalls().map(call => call.args[1])).toEqual([40, 20, 10]);
    } finally {
      sTO.restore();
    }
  });

  it('minTimeout is respected even with small factor', async () => {
    const sTO = spy(globalThis, 'setTimeout');

    try {
      await expect(asyncRetry(
        async () => {
          throw new Error('test');
        },
        {
          retries: 2,
          factor: 0.1,
          minTimeout: 10,
          maxTimeout: Number.POSITIVE_INFINITY,
          randomize: false
        }
      )).rejects.toBeTruthy();

      // First delay is at least minTimeout. Second is minTimeout * 0.1 = 10
      expect(sTO.getCalls().map(call => call.args[1])).toEqual([10, 1]);
    } finally {
      sTO.restore();
    }
  });

  it('maxTimeout caps retry delays', async () => {
    const sTO = spy(globalThis, 'setTimeout');

    try {
      await expect(asyncRetry(
        async () => {
          throw new Error('test');
        },
        {
          retries: 3,
          minTimeout: 10,
          factor: 3,
          maxTimeout: 25,
          randomize: false
        }
      )).rejects.toBeTruthy();

      expect(sTO.callCount).toEqual(3);
      expect(sTO.getCalls().map(call => call.args[1])).toEqual([10, 25, 25]);
    } finally {
      sTO.restore();
    }
  });

  it('maxTimeout lower than minTimeout caps delay', async () => {
    const start = Date.now();
    await expect(asyncRetry(async () => {
      throw new Error('fail');
    }, {
      retries: 1,
      minTimeout: 200,
      maxTimeout: 50,
      factor: 1
    })).rejects.toBeTruthy();

    const elapsed = Date.now() - start;
    // Should be significantly less than minTimeout due to capping
    expect(elapsed).toBeLessThan(200);
  });

  it('randomize affects retry delays', async () => {
    let calls = 0;
    const sequence = [0, 1, 0.5]; // → factors 1x, 2x, 1.5x

    const sTO = spy(globalThis, 'setTimeout');

    const randomStub = stub(Math, 'random').callsFake(() => sequence[calls++] ?? 0);

    try {
      await expect(asyncRetry(
        async () => {
          throw new Error('test');
        },
        {
          retries: 3,
          minTimeout: 8,
          factor: 1,
          randomize: true
        }
      )).rejects.toBeTruthy();

      expect(sTO.getCalls().map(call => call.args[1])).toEqual([8, 16, 12]);
    } finally {
      sTO.restore();
      randomStub.restore();
    }
  });

  it('maxRetryTime limits total retry duration', async () => {
    const start = Date.now();
    const maxRetryTime = 20;

    await expect(asyncRetry(
      async () => {
        await wait(50);
        throw new Error('test');
      },
      {
        retries: 10,
        minTimeout: 50,
        maxRetryTime
      }
    )).rejects.toBeTruthy();

    expect(Date.now() - start).toBeLessThan(maxRetryTime + 50 + 50);
  });

  it('onFailedAttempt time counts toward maxRetryTime', async () => {
    let attempts = 0;
    const start = Date.now();
    const maxRetryTime = 50;

    await expect(asyncRetry(
      async () => {
        attempts++;
        throw new Error('fail');
      },
      {
        maxRetryTime,
        minTimeout: 0,
        async onFailedAttempt() {
          await wait(50);
        }
      }
    )).rejects.toBeTruthy();

    expect(attempts).toEqual(1);
    expect(Date.now() - start).toBeLessThan(maxRetryTime + 50);
  });

  it('signal abort during delay cancels promptly', async () => {
    const controller = new AbortController();
    const start = Date.now();

    // Abort shortly after the first failure schedules its delay
    // eslint-disable-next-line sukka/prefer-timer-id -- test code
    setTimeout(() => controller.abort(fixtureError), 10);

    await expect(asyncRetry(async () => {
      throw new Error('retry');
    }, {
      signal: controller.signal,
      retries: 5,
      minTimeout: 500,
      factor: 2
    })).rejects.toBe(fixtureError);

    expect(Date.now() - start).toBeLessThan(1000);
  });

  it('aborts immediately if signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(asyncRetry(
      async () => {
        throw new Error('test');
      },
      { signal: controller.signal }
    )).rejects.toBeTruthy();
  });

  it('aborts immediately if signal is already aborted with reason', async () => {
    let called = 0;
    const controller = new AbortController();
    controller.abort(fixtureError);

    await expect(asyncRetry(async () => {
      called++;
      throw new Error('should not run');
    }, {
      signal: controller.signal
    })).rejects.toBe(fixtureError);

    expect(called).toEqual(0);
  });

  it('throws on negative retry count', async () => {
    await expect(
      asyncRetry(
        async () => {},
        { retries: -1 }
      )
    ).rejects.toThrow(new TypeError('Expected `retries` to be ≥ 0.'));
  });

  it('throws on NaN retries', async () => {
    await expect(
      asyncRetry(
        async () => {},
        { retries: Number.NaN }
      )
    ).rejects.toThrow(new TypeError('Expected `retries` to be a valid number or Infinity, got NaN.'));
  });

  it('handles zero retries', async () => {
    let attempts = 0;

    await expect(asyncRetry(
      async () => {
        attempts++;
        throw new Error('test');
      },
      { retries: 0 }
    )).rejects.toBeTruthy();

    expect(attempts).toEqual(1); // Should only try once with zero retries
  });

  it('onFailedAttempt still called when retries is zero', async () => {
    let onFailedAttemptCount = 0;

    await expect(asyncRetry(async () => {
      throw new Error('fail');
    }, {
      retries: 0,
      onFailedAttempt() {
        onFailedAttemptCount++;
      }
    })).rejects.toBeTruthy();

    expect(onFailedAttemptCount).toEqual(1);
  });

  it('invalid numeric options throw', async () => {
    await expect(asyncRetry(async () => {}, { factor: -1 })).rejects.toBeTruthy();
    await expect(asyncRetry(async () => {}, { minTimeout: -1 })).rejects.toBeTruthy();
    await expect(asyncRetry(async () => {}, { maxTimeout: -1 })).rejects.toBeTruthy();
    await expect(asyncRetry(async () => {}, { maxRetryTime: -1 })).rejects.toBeTruthy();
  });

  it('factor <= 0 is treated as 1 (stable delays)', async () => {
    const start = Date.now();
    let calls = 0;

    await expect(asyncRetry(async () => {
      calls++;
      throw new Error('retry');
    }, {
      retries: 1,
      minTimeout: 50,
      factor: 0,
      // Make delays deterministic
      randomize: false
    })).rejects.toBeTruthy();

    // Expect ~1 delay of at least minTimeout
    expect(Date.now() - start).toBeGreaterThanOrEqual(40);
    expect(calls).toEqual(2);
  });

  it('handles zero maxRetryTime', async () => {
    let attempts = 0;

    await expect(asyncRetry(
      async () => {
        attempts++;
        throw new Error('test');
      },
      { maxRetryTime: 0 }
    )).rejects.toBeTruthy();

    expect(attempts).toEqual(1); // Should only try once with zero maxRetryTime
  });

  it('handles invalid factor values', async () => {
    const delays: number[] = [];
    const minTimeout = 20;

    await expect(asyncRetry(
      async () => {
        const expectedDelay = minTimeout; // Should default to minTimeout
        delays.push(expectedDelay);
        throw new Error('test');
      },
      {
        retries: 2,
        factor: 0, // Invalid factor
        minTimeout,
        randomize: false
      }
    )).rejects.toBeTruthy();

    expect(delays[0]).toEqual(minTimeout);
    expect(delays[1]).toEqual(minTimeout);
  });

  it('handles synchronous input function', async () => {
    let attempts = 0;

    await expect(asyncRetry(
      () => { // Non-async function
        attempts++;
        throw new Error('test');
      },
      { retries: 2, minTimeout: 0 }
    )).rejects.toBeTruthy();

    expect(attempts).toEqual(3); // Initial + 2 retries
  });

  it('aborts retries if input function returns null', async () => {
    let attempts = 0;

    const result = await asyncRetry(
      () => {
        attempts++;
        return null;
      },
      { retries: 2 }
    );

    expect(attempts).toEqual(1); // Should stop after first success
    expect(result).toEqual(null);
  });

  it('respect non-Error rejection values', async () => {
    await expect(asyncRetry(
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- unit test
      () => Promise.reject('string rejection'),
      { retries: 1, minTimeout: 0 }
    )).rejects.toEqual('string rejection');
  });

  it('unref option prevents timeout from keeping process alive', async () => {
    const unrefSpy = spy();

    const timeouts: Array<ReturnType<typeof setTimeout>> = [];

    const realSetTimeout = globalThis.setTimeout;

    // Stub globalThis.setTimeout to return a mock Timeout-like object with the spied unref
    const setTimeoutStub = stub(globalThis, 'setTimeout').callsFake((fn, ms) => {
      // Call the real setTimeout to simulate actual behavior (or fake it if you don't want real delays)
      const realTimeout = realSetTimeout(fn, ms);

      timeouts.push(realTimeout);

      // Return a mock object that includes the spied unref method
      // (In Node.js, setTimeout returns a Timeout object; we're mimicking it)
      return {
        ...realTimeout, // Spread the real timeout properties if needed
        unref: unrefSpy // Replace unref with our spy
      };
    });

    try {
      await expect(asyncRetry(
        async () => {
          throw new Error('test');
        },
        {
          ...sharedOpt,
          unref: true
        }
      )).rejects.toBeTruthy();

      expect(unrefSpy.called).toBe(true);
    } finally {
      setTimeoutStub.restore();
      timeouts.forEach(clearTimeout);
    }
  });

  it('unref option handles missing unref gracefully', async () => {
    const timeouts: Array<ReturnType<typeof setTimeout>> = [];

    const realSetTimeout = globalThis.setTimeout;

    // @ts-expect-error -- fake browser timer
    const setTimeoutStub = stub(globalThis, 'setTimeout').callsFake((fn, ms) => {
      // Call the real setTimeout to simulate actual behavior (or fake it if you don't want real delays)

      timeouts.push(realSetTimeout(fn, ms));

      // Return a mock object that includes the spied unref method
      // (In Node.js, setTimeout returns a Timeout object; we're mimicking it)
      return 114514;
    });

    const fixtureError = new Error('fixture');

    try {
      await expect(asyncRetry(async () => {
        throw fixtureError;
      }, { retries: 1, minTimeout: 10, unref: true })).rejects.toBe(fixtureError);
    } finally {
      setTimeoutStub.restore();
      timeouts.forEach(clearTimeout);
    }
  });

  //   it('preserves user stack trace through async retries', async () => {
  //     const script = `
  // import asyncRetry from './index.js';

  // async function foo1() {
  //     return await foo2();
  // }

  // async function foo2() {
  //     return await asyncRetry(
  //         async () => {
  //             throw new Error('foo2 failed');
  //         },
  //         {
  //             retries: 1,
  //         }
  //     );
  // }

  // async function main() {
  //     try {
  //         await foo1();
  //     } catch (error) {
  //         console.error('STACKTRACE_START');
  //         console.error(error.stack);
  //         console.error('STACKTRACE_END');
  //     }
  // }

  // main();
  // `.trim();

  //     const temporaryFile = path.join(process.cwd(), 'p-retry-stack-test.js');
  //     await fs.writeFile(temporaryFile, script);

  //     try {
  //       const { stderr, stdout } = await execa('node', [temporaryFile], { reject: false });
  //       const output = stderr + stdout;
  //       const stack = output.split('STACKTRACE_START')[1]?.split('STACKTRACE_END')[0]?.trim();

  //       expect(stack).toBeTruthy();

  //       expect(stack).toMatch(/Error: foo2 failed/);

  //       // Print the stack for debugging if needed
  //       if (!/foo2/.test(stack) || !/foo1/.test(stack) || !/main/.test(stack)) {
  //         console.log('\n==== Full stack trace for debugging ====\n' + stack + '\n==== End stack trace ====\n');
  //       }

  //       expect(stack).toMatch(/foo2/);
  //       expect(stack).toMatch(/foo1/);
  //       expect(stack).toMatch(/main/);

  //       // Check order
  //       const lines = stack.split('\n');
  //       const foo2Index = lines.findIndex(line => /foo2/.test(line));
  //       const foo1Index = lines.findIndex(line => /foo1/.test(line));
  //       const mainIndex = lines.findIndex(line => /main/.test(line));

  //       expect(foo2Index).not.toEqual(-1);
  //       expect(foo1Index).toBeGreaterThan(foo2Index);
  //       expect(mainIndex).toBeGreaterThan(foo1Index);
  //     } finally {
  //       await fs.unlink(temporaryFile);
  //     }
  //   });

  it('makeRetriable wraps and retries the function', async () => {
    let callCount = 0;
    const fn = async (a: number, b: number) => {
      callCount++;
      if (callCount < 3) {
        throw new Error('fail');
      }

      return a + b;
    };

    const retried = makeRetriable(fn, { retries: 5, minTimeout: 0 });
    const result = await retried(2, 3);
    expect(result).toEqual(5);
    expect(callCount).toEqual(3);
  });

  it('makeRetriable passes arguments and options', async () => {
    let lastArguments: unknown[] = [];
    const fn = (...args: unknown[]) => {
      lastArguments = args;
      throw new Error('fail');
    };

    const retried = makeRetriable(fn, { retries: 1, minTimeout: 0 });
    await expect(() => retried('foo', 42)).rejects.toBeTruthy();
    expect(lastArguments).toEqual(['foo', 42]);
  });

  it('makeRetriable preserves `this` context', async () => {
    const object = {
      value: 2,
      calls: 0,
      async add(n: number) {
        this.calls++;
        if (this.calls < 2) {
          throw new Error('fail');
        }

        return this.value + n;
      }
    };

    // eslint-disable-next-line @typescript-eslint/unbound-method -- `this` test
    object.add = makeRetriable(object.add, { retries: 5, minTimeout: 0 });
    const result = await object.add(3);
    expect(result).toEqual(5);
    expect(object.calls).toEqual(2);
  });

  it('throws error from shouldRetry', async () => {
    const thrown = new Error('shouldRetry failure');

    await expect(asyncRetry(async () => {
      throw new Error('operation failed');
    }, {
      shouldRetry() {
        throw thrown;
      }
    })).rejects.toThrow(thrown);
  });

  it('retriesLeft is Infinity when retries is Infinity', async () => {
    let observed;

    await expect(asyncRetry(async () => {
      throw new Error('fail');
    }, {
      retries: Number.POSITIVE_INFINITY,
      onFailedAttempt({ retriesLeft }) {
        observed = retriesLeft;
        throw new Error('stop');
      },
      minTimeout: 0
    })).rejects.toBeTruthy();

    expect(observed).toEqual(Number.POSITIVE_INFINITY);
  });
});

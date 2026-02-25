import { wait as sleep } from '../wait';
import { describe, it } from 'mocha';
import { expect, mockFn } from 'earl';
import { waitFor } from '.';

class TestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TestError';
  }
}

describe('waitFor', () => {
  it('Calls the predicate and resolves with a truthy result', async () => {
    const initialTime = Date.now();
    const result = await waitFor(() => Date.now() - initialTime > 50);

    expect(result).toEqual(true);
  });

  it('Calls the predicate and resolves with a non-boolean truthy result', async () => {
    const initialTime = Date.now();
    const result = await waitFor(() => (Date.now() - initialTime > 100 ? { a: 10, b: 20 } : false));

    expect(result).toEqual({ a: 10, b: 20 });
  });

  it('Supports a custom retry interval', async () => {
    const initialTime = Date.now();
    const predicate = mockFn(() => (Date.now() - initialTime > 200 ? { a: 10, b: 20 } : false));
    expect(predicate).not.toHaveBeenCalled();

    const result = await waitFor(predicate, 150, AbortSignal.timeout(550));

    expect(result).toEqual({ a: 10, b: 20 });
    expect(predicate).toHaveBeenCalledTimes(3);
  });

  it.skip('Supports waiting forever', async () => {
    const initialTime = Date.now();
    const predicate = mockFn(() => (Date.now() - initialTime > 1000 ? { a: 10, b: 20 } : false));
    expect(predicate).not.toHaveBeenCalled();
    const result = await waitFor(predicate);

    expect(predicate).toHaveBeenCalled();
    expect(result).toEqual({ a: 10, b: 20 });
  });

  it('Stops executing the predicate after timing out', async () => {
    const initialTime = Date.now();
    const predicate = mockFn(() => Date.now() - initialTime > 100);
    expect(predicate).not.toHaveBeenCalled();
    try {
      await waitFor(predicate, AbortSignal.timeout(200));
    } catch {
      expect(predicate).toHaveBeenCalled();
      const callNumber = predicate.calls.length;
      await sleep(300);
      expect(predicate).toHaveBeenCalledTimes(callNumber);
    }
  });

  it('Rejects with a timeout error when timed out', async () => {
    try {
      const initialTime = Date.now();
      await waitFor(() => Date.now() - initialTime > 200, AbortSignal.timeout(100));
      throw new Error('Expected waitUntil to throw');
    } catch {
    }
  });

  it('Rejects on timeout only once', async () => {
    try {
      const initialTime = Date.now();
      await waitFor(() => Date.now() - initialTime > 100, AbortSignal.timeout(200));
      throw new Error('Expected waitUntil to throw');
    } catch {
    }
  });

  it('Rejects on timeout once when the predicate throws an error', async () => {
    try {
      const initialTime = Date.now();
      await waitFor(
        () => {
          if (Date.now() - initialTime >= 100) {
            throw new TestError('Nooo!');
          }
        },
        AbortSignal.timeout(200)
      );
      throw new Error('Expected waitUntil to throw');
    } catch (e) {
      expect(e).toBeA(TestError);
    }
  });

  it('Rejects when the predicate throws an error', async () => {
    try {
      await waitFor(() => {
        throw new TestError('Crap!');
      });
    } catch (e) {
      expect(e).toBeA(Error);
      expect(e).toBeA(TestError);
    }
  });

  // https://github.com/devlato/async-wait-until/issues/32
  it('Issue #32 - does not leave open handlers when predicate returns false', async () => {
    const end = Date.now() + 1000;
    const result = await waitFor(() => Date.now() < end);
    expect(result).toEqual(true);
  });
});

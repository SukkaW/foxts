import { wait as sleep } from '../wait';
import { describe, it } from 'mocha';
import { expect } from 'expect';
import { waitUntil } from '.';
import sinon from 'sinon';

class TestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TestError';
  }
}

describe('waitUntil', () => {
  it('Calls the predicate and resolves with a truthy result', async () => {
    expect.assertions(1);

    const initialTime = Date.now();
    const result = await waitUntil(() => Date.now() - initialTime > 50);

    expect(result).toEqual(true);
  });

  it('Calls the predicate and resolves with a non-boolean truthy result', async () => {
    expect.assertions(1);

    const initialTime = Date.now();
    const result = await waitUntil(() => (Date.now() - initialTime > 100 ? { a: 10, b: 20 } : false));

    expect(result).toEqual({ a: 10, b: 20 });
  });

  it('Supports a custom retry interval', async () => {
    expect.assertions(3);

    const initialTime = Date.now();
    const predicate = sinon.fake(() => (Date.now() - initialTime > 200 ? { a: 10, b: 20 } : false));
    expect(predicate.called).toBe(false);

    const result = await waitUntil(predicate, 150, AbortSignal.timeout(550));

    expect(predicate.callCount < Math.floor(550 / 50) - 1).toBe(true);
    expect(result).toEqual({ a: 10, b: 20 });
  });

  it.skip('Supports waiting forever', async () => {
    expect.assertions(3);

    const initialTime = Date.now();
    const predicate = sinon.fake(() => (Date.now() - initialTime > 1000 ? { a: 10, b: 20 } : false));
    expect(predicate.called).toBe(false);
    const result = await waitUntil(predicate);

    expect(predicate).toHaveBeenCalled();
    expect(result).toEqual({ a: 10, b: 20 });
  });

  it('Stops executing the predicate after timing out', async () => {
    expect.assertions(5);

    const initialTime = Date.now();
    const predicate = sinon.fake(() => Date.now() - initialTime > 100);
    expect(predicate.called).toBe(false);
    try {
      await waitUntil(predicate, AbortSignal.timeout(200));
    } catch {
      expect(predicate).toHaveBeenCalled();
      const callNumber = predicate.callCount;
      await sleep(300);
      expect(predicate.callCount).toBe(callNumber);
    }
  });

  it('Rejects with a timeout error when timed out', async () => {
    try {
      const initialTime = Date.now();
      await waitUntil(() => Date.now() - initialTime > 200, AbortSignal.timeout(100));
      throw new Error('Expected waitUntil to throw');
    } catch {
    }
  });

  it('Rejects on timeout only once', async () => {
    expect.assertions(2);

    try {
      const initialTime = Date.now();
      await waitUntil(() => Date.now() - initialTime > 100, AbortSignal.timeout(200));
      throw new Error('Expected waitUntil to throw');
    } catch {
    }
  });

  it('Rejects on timeout once when the predicate throws an error', async () => {
    try {
      const initialTime = Date.now();
      await waitUntil(
        () => {
          if (Date.now() - initialTime >= 100) {
            throw new TestError('Nooo!');
          }
        },
        AbortSignal.timeout(200)
      );
      throw new Error('Expected waitUntil to throw');
    } catch (e) {
      expect(e).toBeInstanceOf(TestError);
    }
  });

  it('Rejects when the predicate throws an error', async () => {
    expect.assertions(2);

    try {
      await waitUntil(() => {
        throw new TestError('Crap!');
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toBeInstanceOf(TestError);
    }
  });

  // https://github.com/devlato/async-wait-until/issues/32
  it('Issue #32 - does not leave open handlers when predicate returns false', async () => {
    expect.assertions(1);

    const end = Date.now() + 1000;
    const result = await waitUntil(() => Date.now() < end);
    expect(result).toBe(true);
  });
});

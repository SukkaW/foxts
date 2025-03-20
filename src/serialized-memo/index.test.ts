import { describe, it } from 'mocha';
import { expect } from 'expect';
import { createMemoize } from '.';
import { stringify } from 'devalue';

describe('serialized-memo', () => {
  it('should work', async () => {
    const map = new Map<string, string>();
    const cache = createMemoize(map as any, {
      argHasher: stringify
    });

    let counter = 0;
    const fn = (a: number, b: number) => {
      counter++;
      return a + b;
    };

    const memoized = cache(fn);
    expect(await memoized(1, 2)).toBe(3);
    expect(await memoized(1, 2)).toBe(3);
    expect(counter).toBe(1);
  });

  it('only use cached if fail', async () => {
    let counter = 0;
    const fn = (_key: number) => {
      counter++;
      if (counter > 1) {
        throw new Error(counter.toString());
      }

      return counter;
    };

    const map = new Map<string, string>();
    const cache = createMemoize(map as any, {
      onlyUseCachedIfFail: true,
      argHasher: stringify
    });

    const memoized = cache(fn);
    await expect(memoized(1)).resolves.toBe(1);
    await expect(memoized(1)).resolves.toBe(1);
    await expect(memoized(2)).rejects.toThrow('3');
    await expect(memoized(1)).resolves.toBe(1);
    expect(counter).toBe(4);
  });
});

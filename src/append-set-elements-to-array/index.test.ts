import { describe, it } from 'mocha';
import { expect } from 'expect';
import { appendSetElementsToArray } from '.';

describe('identity', () => {
  it('should mutate array no copy', () => {
    const arr = [1, 1, 4];
    expect(appendSetElementsToArray(arr, new Set([5, 1, 4]))).toBe(arr);
  });

  it('should append set elements to array', () => {
    const arr: number[] = [];
    appendSetElementsToArray(arr, new Set([1, 2, 3]));
    expect(arr).toStrictEqual([1, 2, 3]);
  });

  it('should append set elements to array with transformer', () => {
    const arr: number[] = [];
    appendSetElementsToArray(arr, new Set([1, 2, 3]), (item) => item * 2);
    expect(arr).toStrictEqual([2, 4, 6]);
  });
});

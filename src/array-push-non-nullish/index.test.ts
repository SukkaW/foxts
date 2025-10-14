import { describe, it } from 'mocha';
import { expect } from 'expect';
import { arrayPushNonNullish } from '.';

describe('array-push-non-nullish', () => {
  it('arrayPushNonNullish', () => {
    const arr: Array<number | null | undefined> = [1, 2, null, 4, undefined];
    arrayPushNonNullish(arr, 5);
    expect(arr).toEqual([1, 2, null, 4, undefined, 5]);
    arrayPushNonNullish(arr, null);
    expect(arr).toEqual([1, 2, null, 4, undefined, 5]);
    arrayPushNonNullish(arr, undefined);
    expect(arr).toEqual([1, 2, null, 4, undefined, 5]);
    arrayPushNonNullish(arr, [6, null, 7, undefined, 8]);
    expect(arr).toEqual([1, 2, null, 4, undefined, 5, 6, 7, 8]);
  });
});

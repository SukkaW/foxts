import { describe, it } from 'mocha';
import { expect } from 'earl';
import { createFixedArrayWithGC, createFixedArrayWithoutGC } from '.';

describe('createFixedArray', () => {
  it('should create fixed array without GC', () => {
    const arr = createFixedArrayWithoutGC(3);
    expect(arr).toEqual([0, 1, 2]);

    expect(createFixedArrayWithoutGC(3)).toEqual(arr);
  });

  it('should create fixed array with GC', () => {
    const arr = createFixedArrayWithGC(3);
    expect(arr).toEqual([0, 1, 2]);

    expect(createFixedArrayWithGC(3)).toEqual(arr);
  });
});

import { describe, it } from 'mocha';
import { expect } from 'expect';
import { appendArrayInPlace, appendArrayInPlaceCurried } from '.';
import { createFixedArray } from '../create-fixed-array';

describe('appendArrayInPlace', () => {
  it('should work', () => {
    expect(appendArrayInPlace([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('handle 65535+ items', () => {
    expect(
      appendArrayInPlace(
        createFixedArray(114514).slice(),
        createFixedArray(1_919_810).slice()
      )
    ).toHaveLength(114514 + 1_919_810);
  });

  it('curied', () => {
    const push = appendArrayInPlaceCurried([1, 2, 3]);
    expect(push([4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

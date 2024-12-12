import { describe, it } from 'mocha';
import { expect } from 'expect';
import { addArrayElementsToSet } from '.';

describe('add-array-elements-to-set', () => {
  it('should work', () => {
    expect(addArrayElementsToSet(new Set([1, 2, 3]), [4, 5, 6])).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  });
});

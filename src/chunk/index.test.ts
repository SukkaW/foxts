import { chunk } from './index';
import { expect } from 'expect';

describe('chunk', () => {
  it('should work', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
});

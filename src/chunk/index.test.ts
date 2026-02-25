import { chunk } from './index';
import { expect } from 'earl';

describe('chunk', () => {
  it('should work', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
});

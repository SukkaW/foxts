import { clamp } from './index';
import { expect } from 'earl';

describe('clamp', () => {
  it('should work with 3 arguments', () => {
    expect(clamp(5, 0, 10)).toEqual(5);
    expect(clamp(-5, 0, 10)).toEqual(0);
    expect(clamp(15, 0, 10)).toEqual(10);
    expect(clamp(0, 0, 10)).toEqual(0);
    expect(clamp(10, 0, 10)).toEqual(10);
  });

  it('should work curried', () => {
    const clampToRange = clamp(0, 10);

    expect(clampToRange(5)).toEqual(5);
    expect(clampToRange(-5)).toEqual(0);
    expect(clampToRange(15)).toEqual(10);
    expect(clampToRange(0)).toEqual(0);
    expect(clampToRange(10)).toEqual(10);
  });
});

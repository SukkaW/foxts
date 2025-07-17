import { describe, it } from 'mocha';
import { expect } from 'expect';
import { shuffleArray } from '.';

const fakeRandom = () => 0.5;

describe('shuffle-array', () => {
  it('empty', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('single element', () => {
    expect(shuffleArray([1])).toEqual([1]);
  });

  it('custom random function', () => {
    expect(shuffleArray([1, 2, 3], { random: fakeRandom })).toEqual([1, 3, 2]);
  });

  it('copy array', () => {
    const arr = [1, 2, 3];
    const shuffled = shuffleArray(arr, { copy: true, random: fakeRandom });
    expect(shuffled).toEqual([1, 3, 2]);
    expect(arr).toEqual([1, 2, 3]); // original array should not be modified
  });
});

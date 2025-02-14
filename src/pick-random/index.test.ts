import { describe, it } from 'mocha';
import { expect } from 'expect';
import { pickOne, pickRandom } from '.';

describe('random-int', () => {
  it('pickOne', () => {
    expect(pickOne([0])).toBe(0);
    expect(pickOne([0, 1])).toBeLessThanOrEqual(1);
  });

  it('pickRandom', () => {
    expect(pickRandom([0], 1)).toEqual([0]);
    expect(pickRandom([0, 1], 2).length).toEqual(2);
  });
});

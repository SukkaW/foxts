import { describe, it } from 'mocha';
import { expect } from 'earl';
import { createRandomInt, randomInt } from '.';

describe('random-int', () => {
  it('randomInt', () => {
    expect(randomInt(0, 0)).toEqual(0);
    expect(randomInt(0, 1)).toBeLessThanOrEqual(1);
    expect(randomInt(0, 1)).toBeGreaterThanOrEqual(0);
  });

  // it('randomIntSecure', () => {
  //   expect(randomIntSecure(0, 0)).toEqual(0);
  //   expect(randomIntSecure(0, 1)).toBeLessThanOrEqual(1);
  //   expect(randomIntSecure(0, 1)).toBeGreaterThanOrEqual(0);
  // });

  it('createRandomInt', () => {
    const randomInt = createRandomInt(() => 0.5);

    expect(randomInt(0, 0)).toEqual(0);
    expect(randomInt(0, 1)).toEqual(1);
    expect(randomInt(0, 2)).toEqual(1);
  });
});

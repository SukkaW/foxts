import { describe, it } from 'mocha';
import { expect } from 'earl';
import { once } from '.';

describe('once', () => {
  it('should work', () => {
    const rand = once(() => Math.random());
    const value = rand();

    expect(rand()).toEqual(value);
    expect(rand()).toEqual(value);
    expect(rand()).toEqual(value);
  });
});

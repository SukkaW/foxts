import { describe, it } from 'mocha';
import { expect } from 'expect';
import { once } from '.';

describe('once', () => {
  it('should work', () => {
    const rand = once(() => Math.random());
    const value = rand();

    expect(rand()).toBe(value);
    expect(rand()).toBe(value);
    expect(rand()).toBe(value);
  });
});

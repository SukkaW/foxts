import { expect } from 'expect';
import { lazyValue } from '.';

describe('lazy-value', () => {
  it('lazy', () => {
    let index = 0;
    const value1 = lazyValue(() => ++index);
    expect(value1()).toBe(1);
    expect(value1()).toBe(1);
    expect(value1()).toBe(1);

    index = 0;
    const value2 = lazyValue(() => {
      index++;
      return null;
    });

    expect(value2()).toBe(null);
    expect(value2()).toBe(null);
    expect(index).toBe(1);
  });
});

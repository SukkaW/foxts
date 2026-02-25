import { expect } from 'earl';
import { lazyValue } from '.';

describe('lazy-value', () => {
  it('lazy', () => {
    let index = 0;
    const value1 = lazyValue(() => ++index);
    expect(value1()).toEqual(1);
    expect(value1()).toEqual(1);
    expect(value1()).toEqual(1);

    index = 0;
    const value2 = lazyValue(() => {
      index++;
      return null;
    });

    expect(value2()).toEqual(null);
    expect(value2()).toEqual(null);
    expect(index).toEqual(1);
  });
});

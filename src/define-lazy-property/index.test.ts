import { expect } from 'expect';
import { defineLazyProperty } from '.';

describe('define-lazy-property', () => {
  it('defineLazyProperty', () => {
    const object: any = {};
    let index = 0;

    defineLazyProperty(object, 'x', () => {
      index++;
      return 'foo';
    });

    expect(object.x).toEqual('foo');
    expect(object.x).toEqual('foo');
    expect(index).toEqual(1);

    object.x = 'bar';
    expect(object.x).toEqual('bar');
    expect(index).toEqual(1);
  });
});

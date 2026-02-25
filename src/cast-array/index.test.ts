import { describe, it } from 'mocha';
import { expect } from 'earl';
import { castArray } from '.';

describe('castArray', () => {
  ([
    [undefined, []],
    [null, []],
    [false, [false]],
    [0, [0]],
    ['', ['']],
    [[], []],
    ['foo', ['foo']],
    [['foo'], ['foo']]
  ]).forEach(([input, expected]) => {
    it(`(${JSON.stringify(input)}) => ${JSON.stringify(expected)}`, () => {
      expect(castArray(input)).toEqual(expected);
    });
  });
});

import { describe, it } from 'mocha';
import { expect } from 'earl';
import { splitNth, splitFirst, splitSecond } from '.';

describe('split-nth', () => {
  const cases: Array<[str: string, sep: string]> = [
    ['foo\nbar\nbaz', '\n'],
    ['foo', '\n'],
    ['', ','],
    [',', ','],
    ['a,', ','],
    [',a', ','],
    ['a,,b', ','],
    ['aaa', 'aa'],
    ['abcabc', 'bc'],
    ['a--b---c', '--'],
    ['abc', ''],
    ['', ''],
    ['🦊fox', ''],
    ['🦊a🦊b🦊', '🦊']
  ];

  it('should match String.prototype.split(sep)[index]', () => {
    for (const [str, sep] of cases) {
      const expected = str.split(sep);
      for (let i = 0; i <= expected.length; i++) {
        expect(splitNth(str, sep, i)).toEqual(expected[i]);
      }
    }
  });

  it('should return undefined for negative or non-integer index', () => {
    expect(splitNth('a,b', ',', -1)).toEqual(undefined);
    expect(splitNth('a,b', ',', 0.5)).toEqual(undefined);
    expect(splitNth('a,b', ',', Number.NaN)).toEqual(undefined);
  });

  it('splitFirst should match String.prototype.split(sep)[0]', () => {
    for (const [str, sep] of cases) {
      if (sep === '') continue; // splitFirst requires non-empty sep
      expect(splitFirst(str, sep)).toEqual(str.split(sep)[0]);
    }
    expect(splitFirst('foo', '\n')).toEqual('foo');
    expect(splitFirst('foo\nbar', '\n')).toEqual('foo');
  });

  it('splitSecond should match String.prototype.split(sep)[1]', () => {
    for (const [str, sep] of cases) {
      if (sep === '') continue; // splitSecond requires non-empty sep
      expect(splitSecond(str, sep)).toEqual(str.split(sep)[1]);
    }
    expect(splitSecond('foo', '\n')).toEqual(undefined);
    expect(splitSecond('foo\nbar\nbaz', '\n')).toEqual('bar');
  });
});

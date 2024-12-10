import { describe, it } from 'mocha';
import { expect } from 'expect';
import { fastStringArrayJoin } from '.';

describe('fast-string-join', () => {
  it('should work', () => {
    expect(fastStringArrayJoin([], ' ')).toBe('');
    expect(fastStringArrayJoin(['a', 'b', 'c'], ' ')).toBe('a b c');
  });
});

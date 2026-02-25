import { describe, it } from 'mocha';
import { expect } from 'earl';
import { fastStringArrayJoin } from '.';

describe('fast-string-join', () => {
  it('should work', () => {
    expect(fastStringArrayJoin([], ' ')).toEqual('');
    expect(fastStringArrayJoin(['a', 'b', 'c'], ' ')).toEqual('a b c');
  });
});

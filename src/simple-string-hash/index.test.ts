import { describe, it } from 'mocha';
import { expect } from 'earl';
import { simpleStringHash } from '.';

describe('simple-string-hash', () => {
  const hash1 = 'hello world';
  const hash2 = 'the quick brown fox jumps over the lazy dog';

  it('should work', () => {
    expect(simpleStringHash(hash1)).toEqual('stglysbf6mb');
    expect(simpleStringHash(hash2)).toEqual('dbmptkpu5s17');
  });
});

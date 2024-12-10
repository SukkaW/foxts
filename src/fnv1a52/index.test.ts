import { describe, it } from 'mocha';
import { expect } from 'expect';
import { fnv1a52 } from '.';

describe('fnv1a52', () => {
  const hash1 = 'hello world';
  const hash2 = 'the quick brown fox jumps over the lazy dog';

  it('should work', () => {
    expect(fnv1a52(hash1)).toBe(2_926_792_616_498_590);
    expect(fnv1a52(hash2)).toBe(1_353_091_865_156_848);
  });
});

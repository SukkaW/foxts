import { describe, it } from 'mocha';
import { expect } from 'earl';
import { fnv1a52, fnv1a52hex } from '.';

describe('fnv1a52', () => {
  const hash1 = 'hello world';
  const hash2 = 'the quick brown fox jumps over the lazy dog';

  it('fnv1a52', () => {
    expect(fnv1a52(hash1)).toEqual(2_926_792_616_498_590);
    expect(fnv1a52(hash2)).toEqual(1_353_091_865_156_848);
  });

  it('fnv1a52hex', () => {
    expect(fnv1a52hex(hash1)).toEqual(fnv1a52(hash1).toString(16));
  });
});

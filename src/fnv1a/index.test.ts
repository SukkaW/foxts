import { describe, it } from 'mocha';
import { expect } from 'expect';
import { fnv1a } from '.';

describe('fnv1a', () => {
  const hash1 = 'hello world';
  const hash2 = 'the quick brown fox jumps over the lazy dog';

  it('should work', () => {
    expect(fnv1a(hash1)).toBe(3_582_672_807);
    expect(fnv1a(hash2)).toBe(4_016_652_272);
  });
});

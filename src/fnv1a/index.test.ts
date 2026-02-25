import { describe, it } from 'mocha';
import { expect } from 'earl';
import { fnv1ahex, fnv1a } from '.';

export function sinderSlowFnv1a(s: string) {
  let h = 0x81_1C_9D_C5;

  for (let i = 0, l = s.length; i < l; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }

  return (h >>> 0);
}

describe('fnv1a', () => {
  const hash1 = 'hello world';
  const hash2 = 'the quick brown fox jumps over the lazy dog';

  it('fnv1a', () => {
    expect(fnv1a(hash1)).toEqual(3_582_672_807);
    expect(fnv1a(hash2)).toEqual(4_016_652_272);

    expect(sinderSlowFnv1a(hash1)).toEqual(sinderSlowFnv1a(hash1));
    expect(sinderSlowFnv1a(hash2)).toEqual(sinderSlowFnv1a(hash2));
  });

  it('fnv1a hex', () => {
    expect(fnv1ahex(hash1)).toEqual(fnv1a(hash1).toString(16));
    expect(fnv1ahex(hash2)).toEqual(fnv1a(hash2).toString(16));
  });
});

import { fnv1a, fnv1ahex } from '.';

export function sinderSlowFnv1a(s: string) {
  let h = 0x81_1C_9D_C5;

  for (let i = 0, l = s.length; i < l; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }

  return (h >>> 0);
}

(async () => {
  const { bench, group, run } = await import('mitata');

  group('fnv1a', () => {
    bench('sinderSlowFnv1a', () => {
      sinderSlowFnv1a('the quick brown fox jumps over the lazy dog').toString(16);
    });
    bench('foxts/fnv1a', () => {
      fnv1a('the quick brown fox jumps over the lazy dog');
    });
  });

  group('hex', () => {
    bench('toString(16)', () => {
      fnv1a('the quick brown fox jumps over the lazy dog').toString(16);
    });
    bench('fnv1ahex', () => {
      fnv1ahex('the quick brown fox jumps over the lazy dog');
    });
  });

  run();
})();

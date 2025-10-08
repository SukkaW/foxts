import { fnv1a52, fnv1a52hex } from '.';

(async () => {
  const { bench, group, run } = await import('mitata');

  group('fnv1a52 - hex', () => {
    bench('fnv1a52 + toString(16)', () => {
      fnv1a52('the quick brown fox jumps over the lazy dog').toString(16);
    });
    bench('fnv1a52hex', () => {
      fnv1a52hex('the quick brown fox jumps over the lazy dog');
    });
  });

  run();
})();

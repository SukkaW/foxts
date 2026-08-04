import { splitNth, splitFirst, splitSecond } from '.';
import { createFixedArray } from '../create-fixed-array';

(async () => {
  const { group, bench, run, do_not_optimize } = await import('mitata');

  const lines = createFixedArray(64).map((i) => `line ${i} lorem ipsum dolor sit amet`).join('\n');

  group('split(sep)[0]', () => {
    bench('splitFirst', () => { do_not_optimize(splitFirst(lines, '\n')); });
    bench('splitNth', () => { do_not_optimize(splitNth(lines, '\n', 0)); });
    // eslint-disable-next-line sukka/unicorn/prefer-split-limit -- benchmarking the no-limit variant
    bench('String.prototype.split(sep)[0]', () => { do_not_optimize(lines.split('\n')[0]); });
    bench('String.prototype.split(sep, 1)[0]', () => { do_not_optimize(lines.split('\n', 1)[0]); });
  });

  group('split(sep)[1]', () => {
    bench('splitSecond', () => { do_not_optimize(splitSecond(lines, '\n')); });
    bench('splitNth', () => { do_not_optimize(splitNth(lines, '\n', 1)); });
    // eslint-disable-next-line sukka/unicorn/prefer-split-limit -- benchmarking the no-limit variant
    bench('String.prototype.split(sep)[1]', () => { do_not_optimize(lines.split('\n')[1]); });
    bench('String.prototype.split(sep, 2)[1]', () => { do_not_optimize(lines.split('\n', 2)[1]); });
  });

  group('split(sep)[2]', () => {
    bench('splitNth', () => { do_not_optimize(splitNth(lines, '\n', 2)); });
    // eslint-disable-next-line sukka/unicorn/prefer-split-limit -- benchmarking the no-limit variant
    bench('String.prototype.split(sep)[2]', () => { do_not_optimize(lines.split('\n')[2]); });
    bench('String.prototype.split(sep, 3)[2]', () => { do_not_optimize(lines.split('\n', 3)[2]); });
  });

  group('split(sep)[last]', () => {
    bench('splitNth', () => { do_not_optimize(splitNth(lines, '\n', 63)); });
    // eslint-disable-next-line sukka/unicorn/prefer-split-limit -- benchmarking the no-limit variant
    bench('String.prototype.split(sep)[63]', () => { do_not_optimize(lines.split('\n')[63]); });
    bench('String.prototype.split(sep, 64)[63]', () => { do_not_optimize(lines.split('\n', 64)[63]); });
  });

  await run({
    colors: true
  });
})();

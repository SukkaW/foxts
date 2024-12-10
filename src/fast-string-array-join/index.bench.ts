import { fastStringArrayJoin } from '.';

(async () => {
  const { group, bench, run } = await import('mitata');

  const classNames = ['primary', 'selected', 'active', 'medium'];

  group('fastStringArrayJoin vs Array.prototype.join', () => {
    bench('fastStringArrayJoin', () => fastStringArrayJoin(classNames, ' '));
    bench('Array.prototype.join', () => classNames.join(' '));
  });

  await run({
    colors: true
  });
})();

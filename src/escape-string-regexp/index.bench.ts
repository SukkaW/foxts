/* eslint-disable @typescript-eslint/no-restricted-imports -- benchmark */
import { escapeStringRegexp } from '.';
import { escapeRegExp as hexoUtilEscapeRegExp } from 'hexo-util';
import escapeStringRegexpSindresorhus from 'escape-string-regexp';
import escapeRegExp from 'escape-regexp';
import lodashEscapeRegExp from 'lodash.escaperegexp';
import RegexEscape from 'regex-escape';

(async () => {
  const { bench, group, run } = await import('mitata');

  const fns = [
    ['foxts/escape-string-regexp', escapeStringRegexp],
    ['hexo-util', hexoUtilEscapeRegExp],
    ['escape-string-regexp', escapeStringRegexpSindresorhus],
    ['escape-regexp', escapeRegExp],
    ['lodash.escaperegexp', lodashEscapeRegExp],
    ['regex-escape', RegexEscape]
  ] as const;

  group('short', () => {
    const fixture = '{#/}';

    fns.forEach(([name, fn]) => {
      bench(name, () => fn(fixture));
    });
  });

  group('full', () => {
    const fixture = String.raw`^$\.*+?()[]{}|`;

    fns.forEach(([name, fn]) => {
      bench(name, () => fn(fixture));
    });
  });

  run();
})();

import { createAhoCorasick } from '.';

import ModernAhoCorasick from 'modern-ahocorasick';
import { AhoCorasick as MonyoneAhoCorasick } from '@monyone/aho-corasick';
// @ts-expect-error -- no types
import FastScanner from 'fastscan';
// eslint-enable import-x/no-unresolved

function runKeywordFilter(data: string[], testFn: (line: string) => boolean) {
  for (let i = 0, len = data.length; i < len; i++) {
    testFn(data[i]);
  }
}

export function getFns(keywordsSet: string[] | readonly string[]) {
  const tmp1 = new ModernAhoCorasick(keywordsSet.slice());
  const tmp2 = new MonyoneAhoCorasick(keywordsSet.slice());
  const scanner = new FastScanner(keywordsSet.slice());

  return [
    ['createKeywordFilter', createAhoCorasick(keywordsSet.slice())],
    ['modern-ahocorasick', (line: string) => tmp1.match(line)],
    ['@monyone/aho-corasick', (line: string) => tmp2.hasKeywordInText(line)],
    ['fastscan', (line: string) => scanner.search(line).length > 0]
  ] as const;
}

if (require.main === module) {
  (async () => {
    const { bench, group, run } = await import('mitata');

    const data = (await ((await fetch('https://easylist.to/easylist/easylist.txt')).text())).split('\n');
    const keywordsSet = [
      '!',
      '?',
      '*',
      '[',
      '(',
      ']',
      ')',
      ',',
      '#',
      '%',
      '&',
      '=',
      '~',
      // special modifier
      '$popup',
      '$removeparam',
      '$popunder',
      '$cname',
      '$frame',
      // some bad syntax
      '^popup'
    ];

    const fns = getFns(keywordsSet);

    group(() => {
      fns.forEach(([name, fn]) => {
        bench(name, () => runKeywordFilter(data, fn));
      });
    });

    run();
  })();
}

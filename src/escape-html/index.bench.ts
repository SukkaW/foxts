import path from 'node:path';
import fs from 'node:fs';

import { escapeHTML } from '.';
import npmEscapeHtml from 'escape-html';
import { escapeHTML as hexoUtilEscapeHtml } from 'hexo-util';
import { escape as htmlEscaper } from 'html-escaper';
import { htmlEscape as escapeGoat } from 'escape-goat';
import lodashEscape from 'lodash.escape';

(async () => {
  const { bench, group, run } = await import('mitata');

  const fns = [
    ['foxts/escape-html', escapeHTML],
    ['escape-html', npmEscapeHtml],
    ['hexo-util', hexoUtilEscapeHtml],
    ['html-escaper', htmlEscaper],
    ['escape-goat', escapeGoat],
    ['lodash.escape', lodashEscape]
  ] as const;

  group('skk.moe', () => {
    const fixture = fs.readFileSync(path.join(__dirname, './skk.moe.html'), 'utf-8');

    fns.forEach(([name, fn]) => {
      bench(name, () => fn(fixture));
    });
  });

  group('github.com (incognito)', () => {
    const fixture = fs.readFileSync(path.join(__dirname, './github.com.html'), 'utf-8');

    fns.forEach(([name, fn]) => {
      bench(name, () => fn(fixture));
    });
  });

  run();
})();

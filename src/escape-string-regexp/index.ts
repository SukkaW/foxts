const r = /[$()*+.?[\\\]^{|}-]/g;

const escapes = {
  /* eslint-disable sukka/unicorn/prefer-string-raw -- performance */
  '\\': '\\\\',
  '^': '\\^',
  $: '\\$',
  '.': '\\.',
  '*': '\\*',
  '+': '\\+',
  '?': '\\?',
  '(': '\\(',
  ')': '\\)',
  '[': '\\[',
  ']': '\\]',
  '{': '\\{',
  '}': '\\}',
  '|': '\\|',
  '-': '\\x2d'
  /* eslint-enable sukka/unicorn/prefer-string-raw */
};

const replacer = (chr: string) => escapes[chr as keyof typeof escapes];

export function escapeStringRegexp(string: string) {
  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replaceAll(r, replacer);
};

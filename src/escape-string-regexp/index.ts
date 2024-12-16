const r = /[$()*+.?[\\\]^{|}]/g;

export function escapeStringRegexp(string: string) {
  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string
    // eslint-disable-next-line sukka/unicorn/prefer-string-raw -- performance
    .replaceAll(r, '\\$&')
    // eslint-disable-next-line sukka/unicorn/prefer-string-raw -- performance
    .replaceAll('-', '\\x2d');
};

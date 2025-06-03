const r = /[$()*+.?[\\\]^{|}-]/;

/**
 * Escape characters with special meaning either inside or outside character sets.
 * Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
 */
export function escapeStringRegexp(str: string) {
  const match = r.exec(str);

  if (match === null) {
    return str;
  }

  let escape = '';
  let regexp = '';

  let index = match.index;
  let lastIndex = 0;

  // iterate from the first match
  for (const len = str.length; index < len; index++) {
    /* eslint-disable sukka/unicorn/prefer-string-raw -- performance */
    switch (str.charCodeAt(index)) {
      case 92: // \
        escape = '\\\\';
        break;
      case 94: // ^
        escape = '\\^';
        break;
      case 36: // $
        escape = '\\$';
        break;
      case 46: // .
        escape = '\\.';
        break;
      case 42: // *
        escape = '\\*';
        break;
      case 43: // +
        escape = '\\+';
        break;
      case 63: // ?
        escape = '\\?';
        break;
      case 40: // (
        escape = '\\(';
        break;
      case 41: // )
        escape = '\\)';
        break;
      case 91: // [
        escape = '\\[';
        break;
      case 93: // ]
        escape = '\\]';
        break;
      case 123: // {
        escape = '\\{';
        break;
      case 125: // }
        escape = '\\}';
        break;
      case 124: // |
        escape = '\\|';
        break;
      case 45: // -
        escape = '\\x2d';
        break;
      default:
        continue;
    }
    /* eslint-enable sukka/unicorn/prefer-string-raw */

    if (lastIndex !== index) {
      regexp += str.slice(lastIndex, index);
    }

    lastIndex = index + 1;
    regexp += escape;
  }

  if (lastIndex !== index) {
    regexp += str.slice(lastIndex, index);
  }

  return regexp;
};

import { describe, it } from 'mocha';
import { expect } from 'expect';
import { escapeStringRegexp } from '.';

describe('escapeStringRegexp', () => {
  it('should work', () => {
    expect(escapeStringRegexp(String.raw`\ ^ $ * + ? . ( ) | { } [ ]`)).toBe(String.raw`\\ \^ \$ \* \+ \? \. \( \) \| \{ \} \[ \]`);
  });

  it('escapes `-` in a way compatible with PCRE', () => {
    expect(escapeStringRegexp('foo - bar')).toBe(String.raw`foo \x2d bar`);
  });

  it('escapes `-` in a way compatible with the Unicode flag', () => {
    expect(new RegExp(escapeStringRegexp('-'), 'u').test('-')).toBe(true);
  });
});

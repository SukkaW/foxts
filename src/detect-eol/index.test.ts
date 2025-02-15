import { describe, it } from 'mocha';
import { expect } from 'expect';
import { detectEol } from '.';

describe('detectEol', () => {
  it('should detect LF', () => {
    expect(detectEol('foo\nbar')).toBe('\n');
    expect(detectEol('foo\nbar\n')).toBe('\n');
  });

  it('should detect CRLF', () => {
    expect(detectEol('foo\r\nbar')).toBe('\r\n');
    expect(detectEol('foo\r\nbar\r\n')).toBe('\r\n');
  });

  it('should default to LF', () => {
    expect(detectEol('foo')).toBe('\n');
  });
});

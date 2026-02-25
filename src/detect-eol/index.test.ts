import { describe, it } from 'mocha';
import { expect } from 'earl';
import { detectEol } from '.';

describe('detectEol', () => {
  it('should detect LF', () => {
    expect(detectEol('foo\nbar')).toEqual('\n');
    expect(detectEol('foo\nbar\n')).toEqual('\n');
  });

  it('should detect CRLF', () => {
    expect(detectEol('foo\r\nbar')).toEqual('\r\n');
    expect(detectEol('foo\r\nbar\r\n')).toEqual('\r\n');
  });

  it('should default to LF', () => {
    expect(detectEol('foo')).toEqual('\n');
  });
});

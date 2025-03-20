import { describe, it } from 'mocha';
import { expect } from 'expect';
import { stringJoin } from '.';

describe('string-join', () => {
  it('should work', () => {
    expect(stringJoin([null, '1'], ' ')).toBe('1');
    expect(stringJoin([undefined, '1', '2'], ' ')).toBe('1 2');
    expect(stringJoin(['1', '2'])).toBe('1,2');
  });

  it('dedupe', () => {
    expect(stringJoin(['1', '1', '2'], ' ', true)).toBe('1 2');
  });
});

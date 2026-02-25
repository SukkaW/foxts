import { describe, it } from 'mocha';
import { expect } from 'expect';
import { literal } from '.';

describe('literal', () => {
  it('should work', () => {
    expect(literal('a')).toBe('a');
    expect(literal(1)).toBe(1);
    expect(literal({ a: 1 })).toStrictEqual({ a: 1 });
  });
});

import { describe, it } from 'mocha';
import { expect } from 'earl';
import { literal } from '.';

describe('literal', () => {
  it('should work', () => {
    expect(literal('a')).toEqual('a');
    expect(literal(1)).toEqual(1);
    expect(literal({ a: 1 })).toEqual({ a: 1 });
  });
});

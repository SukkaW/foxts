import { describe, it } from 'mocha';
import { expect } from 'expect';
import { identity } from '.';

describe('identity', () => {
  it('should work', () => {
    expect(identity('a')).toBe('a');
    expect(identity(1)).toBe(1);
    expect(identity({ a: 1 })).toStrictEqual({ a: 1 });
  });
});

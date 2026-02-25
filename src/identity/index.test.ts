import { describe, it } from 'mocha';
import { expect } from 'earl';
import { identity } from '.';

describe('identity', () => {
  it('should work', () => {
    expect(identity('a')).toEqual('a');
    expect(identity(1)).toEqual(1);
    expect(identity({ a: 1 })).toEqual({ a: 1 });
  });
});

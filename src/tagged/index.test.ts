import { describe, it } from 'mocha';
import { expect } from 'earl';
import { tagged } from '.';

describe('tagged', () => {
  it('should work', () => {
    expect(tagged`hello ${'world'}`).toEqual('hello world');
    expect(tagged`the quick ${'brown'} fox jumps over the lazy ${'dog'}`).toEqual('the quick brown fox jumps over the lazy dog');
  });
});

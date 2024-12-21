import { describe, it } from 'mocha';
import { expect } from 'expect';
import { tagged } from '.';

describe('tagged', () => {
  it('should work', () => {
    expect(tagged`hello ${'world'}`).toBe('hello world');
    expect(tagged`the quick ${'brown'} fox jumps over the lazy ${'dog'}`).toBe('the quick brown fox jumps over the lazy dog');
  });
});

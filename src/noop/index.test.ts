import { describe, it } from 'mocha';
import { expect } from 'expect';
import { noop } from '.';

describe('noop', () => {
  it('noop', () => {
    expect(noop()).toBe(undefined);
  });
});

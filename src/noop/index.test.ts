import { describe, it } from 'mocha';
import { expect } from 'expect';
import { falseFn, noop, throwFn, trueFn } from '.';

describe('noop', () => {
  it('noop', () => {
    expect(noop()).toBe(undefined);
  });

  it('trueFn', () => {
    expect(trueFn()).toBe(true);
  });

  it('falseFn', () => {
    expect(falseFn()).toBe(false);
  });

  it('throwFn', () => {
    expect(() => throwFn()).toThrow();
  });
});

import { describe, it } from 'mocha';
import { expect } from 'earl';
import { falseFn, noop, throwFn, trueFn } from '.';

describe('noop', () => {
  it('noop', () => {
    expect(noop()).toEqual(undefined);
  });

  it('trueFn', () => {
    expect(trueFn()).toEqual(true);
  });

  it('falseFn', () => {
    expect(falseFn()).toEqual(false);
  });

  it('throwFn', () => {
    expect(() => throwFn()).toThrow();
  });
});

import { describe, it } from 'mocha';
import { expect } from 'expect';
import { isFunction } from '.';

describe('is-function', () => {
  it('should work', () => {
    expect(isFunction(() => { /* */ })).toBe(true);
    // eslint-disable-next-line prefer-arrow-callback -- unit test
    expect(isFunction(function () { /* */ })).toBe(true);
    expect(isFunction(async () => { /* */ })).toBe(true);
    expect(isFunction(function *() { /* */ })).toBe(true);
    expect(isFunction(new (class {})())).toBe(false);
    expect(isFunction(class {})).toBe(true);

    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(1)).toBe(false);
    expect(isFunction('a')).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
  });
});

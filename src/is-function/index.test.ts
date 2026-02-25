import { describe, it } from 'mocha';
import { expect } from 'earl';
import { isFunction } from '.';

describe('is-function', () => {
  it('should work', () => {
    expect(isFunction(() => { /* */ })).toEqual(true);
    // eslint-disable-next-line prefer-arrow-callback -- unit test
    expect(isFunction(function () { /* */ })).toEqual(true);
    expect(isFunction(async () => { /* */ })).toEqual(true);
    expect(isFunction(function *() { /* */ })).toEqual(true);
    expect(isFunction(new (class {})())).toEqual(false);
    expect(isFunction(class {})).toEqual(true);

    expect(isFunction(null)).toEqual(false);
    expect(isFunction(undefined)).toEqual(false);
    expect(isFunction(1)).toEqual(false);
    expect(isFunction('a')).toEqual(false);
    expect(isFunction({})).toEqual(false);
    expect(isFunction([])).toEqual(false);
  });
});

import { describe, it } from 'mocha';
import { expect } from 'earl';
import { not, isFalsy, isNonNull, isNonNullish, isTruthy, is, nullthrow, invariant, never } from '.';

describe('guard', () => {
  it('not', () => {
    expect(not(null)(null)).toEqual(false);
    expect(not(null)(undefined)).toEqual(true);
    expect(not(undefined)(undefined)).toEqual(false);
    expect(not(undefined)(null)).toEqual(true);
    expect(not(false)(false)).toEqual(false);
    expect(not(false)(true)).toEqual(true);
    expect(not('nullish')(null)).toEqual(false);
    expect(not('nullish')(undefined)).toEqual(false);
    expect(not('nullish')(0)).toEqual(true);
    expect(not('falsy')(null)).toEqual(false);
    expect(not('falsy')(undefined)).toEqual(false);
    expect(not('falsy')(0)).toEqual(false);
    expect(not('falsy')(false)).toEqual(false);
    expect(not('falsy')(true)).toEqual(true);
  });

  it('is', () => {
    expect(is(null)(null)).toEqual(true);
    expect(is(null)(undefined)).toEqual(false);
    expect(is(undefined)(undefined)).toEqual(true);
    expect(is(undefined)(null)).toEqual(false);
    expect(is(false)(false)).toEqual(true);
    expect(is(false)(true)).toEqual(false);
    expect(is('nullish')(null)).toEqual(true);
    expect(is('nullish')(undefined)).toEqual(true);
    expect(is('nullish')(0)).toEqual(false);
    expect(is('falsy')(null)).toEqual(true);
    expect(is('falsy')(undefined)).toEqual(true);
    expect(is('falsy')(0)).toEqual(true);
    expect(is('falsy')(false)).toEqual(true);
    expect(is('falsy')(true)).toEqual(false);
    expect(is('truthy')(null)).toEqual(false);
  });

  it('isFalsy', () => {
    expect(isFalsy(null)).toEqual(true);
    expect(isFalsy(undefined)).toEqual(true);
    expect(isFalsy(0)).toEqual(true);
    expect(isFalsy('')).toEqual(true);
    expect(isFalsy(false)).toEqual(true);
    expect(isFalsy(true)).toEqual(false);
  });

  it('isNonNull', () => {
    expect(isNonNull(null)).toEqual(false);
    expect(isNonNull(undefined)).toEqual(true);
    expect(isNonNull(0)).toEqual(true);
    expect(isNonNull('')).toEqual(true);
    expect(isNonNull(false)).toEqual(true);
    expect(isNonNull(true)).toEqual(true);
  });

  it('isNonNullish', () => {
    expect(isNonNullish(null)).toEqual(false);
    expect(isNonNullish(undefined)).toEqual(false);
    expect(isNonNullish(0)).toEqual(true);
    expect(isNonNullish('')).toEqual(true);
    expect(isNonNullish(false)).toEqual(true);
    expect(isNonNullish(true)).toEqual(true);
  });

  it('isTruthy', () => {
    expect(isTruthy(null)).toEqual(false);
    expect(isTruthy(undefined)).toEqual(false);
    expect(isTruthy(0)).toEqual(false);
    expect(isTruthy('')).toEqual(false);
    expect(isTruthy(false)).toEqual(false);
    expect(isTruthy(true)).toEqual(true);
  });

  it('invalid argument', () => {
    expect(() => not('invalid' as any)).toThrow('Unexpected argument');
    expect(() => is('invalid' as any)).toThrow('Unexpected argument');
  });

  it('nullthrow', () => {
    expect(() => nullthrow(null)).toThrow();
    expect(() => nullthrow(undefined)).toThrow();
    expect(nullthrow(0)).toEqual(0);
    expect(nullthrow('')).toEqual('');
    expect(nullthrow(false)).toEqual(false);
    expect(nullthrow(true)).toEqual(true);
    expect(() => nullthrow(null, 'a')).toThrow('a');
  });

  it('invariant', () => {
    expect(() => nullthrow(null)).toThrow();
    expect(() => nullthrow(undefined)).toThrow();
    expect(invariant(0)).toEqual(undefined);
    expect(invariant('')).toEqual(undefined);
    expect(invariant(false)).toEqual(undefined);
    expect(invariant(true)).toEqual(undefined);
    expect(() => invariant(null, 'a')).toThrow('a');
  });

  it('never', () => {
    expect(() => never(null as never)).toThrow();
    expect(() => never(undefined as never)).toThrow();
    expect(() => never(0 as never)).toThrow();
    expect(() => never('' as never)).toThrow();
    expect(() => never(false as never)).toThrow();
    expect(() => never(true as never)).toThrow();
  });
});

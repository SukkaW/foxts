import { describe, it } from 'mocha';
import { expect } from 'expect';
import { not, isFalsy, isNonNull, isNonNullish, isTruthy } from '.';

describe('guard', () => {
  it('not', () => {
    expect(not(null)(null)).toBe(false);
    expect(not(null)(undefined)).toBe(true);
    expect(not(undefined)(undefined)).toBe(false);
    expect(not(undefined)(null)).toBe(true);
    expect(not(false)(false)).toBe(false);
    expect(not(false)(true)).toBe(true);
    expect(not('nullish')(null)).toBe(false);
    expect(not('nullish')(undefined)).toBe(false);
    expect(not('nullish')(0)).toBe(true);
    expect(not('falsy')(null)).toBe(true);
    expect(not('falsy')(undefined)).toBe(true);
    expect(not('falsy')(0)).toBe(true);
    expect(not('falsy')(false)).toBe(true);
    expect(not('falsy')(true)).toBe(false);
  });

  it('isFalsy', () => {
    expect(isFalsy(null)).toBe(true);
    expect(isFalsy(undefined)).toBe(true);
    expect(isFalsy(0)).toBe(true);
    expect(isFalsy('')).toBe(true);
    expect(isFalsy(false)).toBe(true);
    expect(isFalsy(true)).toBe(false);
  });

  it('isNonNull', () => {
    expect(isNonNull(null)).toBe(false);
    expect(isNonNull(undefined)).toBe(true);
    expect(isNonNull(0)).toBe(true);
    expect(isNonNull('')).toBe(true);
    expect(isNonNull(false)).toBe(true);
    expect(isNonNull(true)).toBe(true);
  });

  it('isNonNullish', () => {
    expect(isNonNullish(null)).toBe(false);
    expect(isNonNullish(undefined)).toBe(false);
    expect(isNonNullish(0)).toBe(true);
    expect(isNonNullish('')).toBe(true);
    expect(isNonNullish(false)).toBe(true);
    expect(isNonNullish(true)).toBe(true);
  });

  it('isTruthy', () => {
    expect(isTruthy(null)).toBe(false);
    expect(isTruthy(undefined)).toBe(false);
    expect(isTruthy(0)).toBe(false);
    expect(isTruthy('')).toBe(false);
    expect(isTruthy(false)).toBe(false);
    expect(isTruthy(true)).toBe(true);
  });

  it('invalid argument', () => {
    expect(() => not('invalid' as any)).toThrowError('Invalid argument');
  });
});
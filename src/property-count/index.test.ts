import { keysLength, getOwnPropertyNamesLength, getOwnPropertySymbolsLength } from './index';
import { noop } from '../noop';
import { expect } from 'earl';

describe('property-count', () => {
  describe('keysLength', () => {
    it('should count own enumerable string-keyed properties', () => {
      expect(keysLength({})).toEqual(0);
      expect(keysLength({ a: 1, b: 2 })).toEqual(2);
    });

    it('should count array indices', () => {
      expect(keysLength(['a', 'b', 'c'])).toEqual(3);
    });

    it('should not count inherited properties', () => {
      const proto = { inherited: 1 };
      const obj = Object.create(proto);
      obj.own = 2;
      expect(keysLength(obj)).toEqual(1);
    });

    it('should not count non-enumerable properties', () => {
      const obj = {};
      Object.defineProperty(obj, 'hidden', { value: 1, enumerable: false });
      expect(keysLength(obj)).toEqual(0);
    });

    it('should not count symbol-keyed properties', () => {
      expect(keysLength({ [Symbol('s')]: 1 })).toEqual(0);
    });
  });

  describe('getOwnPropertyNamesLength', () => {
    it('should count own string-keyed properties', () => {
      expect(getOwnPropertyNamesLength({ a: 1, b: 2 })).toEqual(2);
    });

    it('should count both enumerable and non-enumerable properties', () => {
      const obj = { a: 1 };
      Object.defineProperty(obj, 'hidden', { value: 2, enumerable: false });
      expect(getOwnPropertyNamesLength(obj)).toEqual(2);
    });

    it('should count array indices plus the length property', () => {
      // ['a', 'b'] has own names: '0', '1', 'length'
      expect(getOwnPropertyNamesLength(['a', 'b'])).toEqual(3);
    });

    it('should not count inherited properties', () => {
      const proto = { inherited: 1 };
      const obj = Object.create(proto);
      obj.own = 2;
      expect(getOwnPropertyNamesLength(obj)).toEqual(1);
    });

    it('should not count symbol-keyed properties', () => {
      expect(getOwnPropertyNamesLength({ [Symbol('s')]: 1 })).toEqual(0);
    });
  });

  describe('getOwnPropertySymbolsLength', () => {
    it('should count own symbol-keyed properties', () => {
      expect(getOwnPropertySymbolsLength({ [Symbol('s')]: 1 })).toEqual(1);
    });

    it('should count symbol-keyed properties regardless of enumerability', () => {
      const sym = Symbol('hidden');
      const obj = {};
      Object.defineProperty(obj, sym, { value: 1, enumerable: false });
      expect(getOwnPropertySymbolsLength(obj)).toEqual(1);
    });

    it('should not count string-keyed properties', () => {
      expect(getOwnPropertySymbolsLength({ a: 1, b: 2 })).toEqual(0);
    });

    it('should return 0 for objects with no symbol keys', () => {
      expect(getOwnPropertySymbolsLength({})).toEqual(0);
    });

    it('should not count inherited symbol properties', () => {
      const sym = Symbol('inherited');
      const proto = { [sym]: 1 };
      const obj = Object.create(proto);
      expect(getOwnPropertySymbolsLength(obj)).toEqual(0);
    });
  });

  it('should accept functions as targets', () => {
    // functions have own non-enumerable names: 'length', 'name' (and 'prototype' for non-arrows)
    expect(getOwnPropertyNamesLength(noop)).toBeGreaterThan(0);
    expect(keysLength(noop)).toEqual(0);
  });
});

/* eslint-disable sukka/no-object-create-non-null -- specifically test special object */
import { isObjectEmpty } from './index';
import { expect } from 'earl';

describe('isObjectEmpty', () => {
  it('should return true for an empty object literal', () => {
    expect(isObjectEmpty({})).toEqual(true);
  });

  it('should return false for an object with own enumerable properties', () => {
    expect(isObjectEmpty({ a: 1 })).toEqual(false);
    expect(isObjectEmpty({ a: undefined })).toEqual(false);
    expect(isObjectEmpty({ 0: 'zero' })).toEqual(false);
  });

  it('should return true for an object created with Object.create(null)', () => {
    expect(isObjectEmpty(Object.create(null))).toEqual(true);
  });

  it('should return true when the object only has inherited enumerable properties', () => {
    const proto = { inherited: 1 };
    const obj = Object.create(proto);
    expect(isObjectEmpty(obj)).toEqual(true);
  });

  it('should return false once an own property is added over an inherited one', () => {
    const proto = { inherited: 1 };
    const obj = Object.create(proto);
    obj.own = 2;
    expect(isObjectEmpty(obj)).toEqual(false);
  });

  it('should return true when the object only has non-enumerable own properties', () => {
    const obj = {};
    Object.defineProperty(obj, 'hidden', {
      value: 1,
      enumerable: false
    });
    expect(isObjectEmpty(obj)).toEqual(true);
  });
});

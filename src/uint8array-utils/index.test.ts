import { base64ToUint8Array, uint8ArrayToBase64, stringToUint8Array, concatUint8Arrays, toUint8Array, uint8ArrayToString } from '.';
import { expect } from 'expect';
import { describe, it } from 'mocha';

const isUint8ArrayStrict = (value: unknown): value is Uint8Array => Object.getPrototypeOf(value) === Uint8Array.prototype;

describe('uint8array', () => {
  it('should convert uint8ArrayToBase64 and base64ToUint8Array', () => {
    const fixture = stringToUint8Array('Hello');
    const base64 = uint8ArrayToBase64(fixture);
    expect(base64).toBe('SGVsbG8=');
    expect(base64ToUint8Array(base64)).toEqual(fixture);
  });

  it('should handle uint8ArrayToBase64 with 200k items', () => {
    const fixture = stringToUint8Array('H'.repeat(200000));
    const base64 = uint8ArrayToBase64(fixture);
    expect(base64ToUint8Array(base64)).toEqual(fixture);
  });

  it('should handle uint8ArrayToBase64 and base64ToUint8Array with unicode characters', () => {
    const fixture = stringToUint8Array('a Ā 𐀀 文 🦄');
    expect(base64ToUint8Array(uint8ArrayToBase64(base64ToUint8Array(uint8ArrayToBase64(fixture))))).toEqual(fixture);
  });

  it('concatUint8Arrays - combining multiple Uint8Arrays', () => {
    const array1 = new Uint8Array([1, 2, 3]);
    const array2 = new Uint8Array([4, 5, 6]);
    const array3 = new Uint8Array([7, 8, 9]);

    const result = concatUint8Arrays([array1, array2, array3]);
    expect(result).toStrictEqual(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]));
  });

  it('concatUint8Arrays - with an empty array', () => {
    const emptyResult = concatUint8Arrays([]);
    expect(emptyResult).toStrictEqual(new Uint8Array(0));
  });

  it('toUint8Array - TypedArray', () => {
    const fixture = new Float32Array(1);
    expect(isUint8ArrayStrict(toUint8Array(fixture))).toBe(true);
  });

  it('toUint8Array - ArrayBuffer', () => {
    const fixture = new ArrayBuffer(1);
    expect(isUint8ArrayStrict(toUint8Array(fixture))).toBe(true);
  });

  it('toUint8Array - DataView', () => {
    const fixture = new DataView(new ArrayBuffer(1));
    expect(isUint8ArrayStrict(toUint8Array(fixture))).toBe(true);
  });

  it('stringToUint8Array and uint8ArrayToString', () => {
    const fixture = 'Hello';
    const array = stringToUint8Array(fixture);
    expect(array).toEqual(new Uint8Array([72, 101, 108, 108, 111]));
    expect(uint8ArrayToString(array)).toBe(fixture);
  });

  it('uint8ArrayToString with encoding', () => {
    expect(uint8ArrayToString(new Uint8Array([
      207, 240, 232, 226, 229, 242, 44, 32, 236, 232, 240, 33
    ]), 'windows-1251')).toBe('Привет, мир!');

    expect(uint8ArrayToString(new Uint8Array([
      167, 65, 166, 110
    ]), 'big5')).toBe('你好');

    expect(uint8ArrayToString(new Uint8Array([
      130, 177, 130, 241, 130, 201, 130, 191, 130, 205
    ]), 'shift-jis')).toBe('こんにちは');
  });

  it('uint8ArrayToString with ArrayBuffer', () => {
    const fixture = new Uint8Array([72, 101, 108, 108, 111]).buffer;
    expect(uint8ArrayToString(fixture)).toBe('Hello');
  });
});

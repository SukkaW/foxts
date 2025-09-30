import { base64ToUint8Array, uint8ArrayToBase64, stringToUint8Array } from '.';
import { expect } from 'expect';
import { describe, it } from 'mocha';

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
});

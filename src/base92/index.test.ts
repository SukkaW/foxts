import { expect } from 'earl';
import { base92ToUint8Array, uint8ArrayToBase92 } from '.';
import { describe, it } from 'mocha';
import { stringToUint8Array } from '../uint8array-utils';

describe('base92', () => {
  it('should convert uint8ArrayToBase92 and base92ToUint8Array', () => {
    const fixture = stringToUint8Array('a Ā 𐀀 文 🦄');

    const base92 = uint8ArrayToBase92(fixture);
    expect(base92).toEqual('Rg#ZGO:G7\'PdO6mMs;6^mN');
    expect(base92ToUint8Array(base92)).toEqual(fixture);
  });
});

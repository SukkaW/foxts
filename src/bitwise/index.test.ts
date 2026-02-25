import { bitCount, getBit, setBit, deleteBit, packTwoBits, unpackTwoBits, unpackTwoBitsFirst, unpackTwoBitsSecond, packThreeBits, unpackThreeBits, unpackThreeBitsFirst, unpackThreeBitsSecond, unpackThreeBitsThird, missingBit } from './index';
import { expect } from 'earl';

describe('bitwise', () => {
  it('bitCount', () => {
    expect(bitCount(0b1010)).toEqual(2);
    expect(bitCount(0b1011)).toEqual(3);
    expect(bitCount(0b1000)).toEqual(1);
  });

  it('getBit', () => {
    expect(getBit(0b1010, 0b1000)).toEqual(true);
    expect(getBit(0b1010, 0b0100)).toEqual(false);
  });

  it('missingBit', () => {
    expect(missingBit(0b1010, 0b1000)).toEqual(false);
    expect(missingBit(0b1010, 0b0100)).toEqual(true);
  });

  it('setBit', () => {
    expect(setBit(0b1010, 0b0100)).toEqual(0b1110);
    expect(setBit(0b1010, 0b1000)).toEqual(0b1010);
  });

  it('clearBit', () => {
    expect(deleteBit(0b1010, 0b1000)).toEqual(0b0010);
    expect(deleteBit(0b1010, 0b0100)).toEqual(0b1010);
  });

  it('packTwoBits', () => {
    expect(packTwoBits(0x1234, 0x5678)).toEqual(0x12_34_56_78);
  });

  it('unpackTwoBits', () => {
    const arr = packTwoBits(0x1234, 0x5678);
    expect(unpackTwoBits(arr)).toEqual([0x1234, 0x5678]);
  });

  it('unpackTwoBitsFirst', () => {
    expect(unpackTwoBitsFirst(0x12_34_56_78)).toEqual(0x1234);
  });

  it('unpackTwoBitsSecond', () => {
    expect(unpackTwoBitsSecond(0x12_34_56_78)).toEqual(0x5678);
  });

  it('packThreeBits', () => {
    expect(packThreeBits(0x114, 0x51, 0x41)).toEqual(0x11_41_44_41);
    expect(packThreeBits(0x3FF, 0x3FF, 0x3FF)).toEqual(0x3F_FF_FF_FF);
  });

  it('unpackThreeBits', () => {
    const arr = packThreeBits(0x114, 0x51, 0x41);
    expect(unpackThreeBits(arr)).toEqual([0x114, 0x51, 0x41]);
  });

  it('unpackThreeBitsFirst', () => {
    expect(unpackThreeBitsFirst(0x11_41_44_41)).toEqual(0x114);
  });

  it('unpackThreeBitsSecond', () => {
    expect(unpackThreeBitsSecond(0x11_41_44_41)).toEqual(0x51);
  });

  it('unpackThreeBitsThird', () => {
    expect(unpackThreeBitsThird(0x11_41_44_41)).toEqual(0x41);
  });
});

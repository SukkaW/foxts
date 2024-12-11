import { bitCount, getBit, setBit, deleteBit, packTwoBits, unpackTwoBits, unpackTwoBitsFirst, unpackTwoBitsSecond, packThreeBits, unpackThreeBits, unpackThreeBitsFirst, unpackThreeBitsSecond, unpackThreeBitsThird } from './index';
import expect from 'expect';

describe('bitwise', () => {
  it('bitCount', () => {
    expect(bitCount(0b1010)).toBe(2);
    expect(bitCount(0b1011)).toBe(3);
    expect(bitCount(0b1000)).toBe(1);
  });

  it('getBit', () => {
    expect(getBit(0b1010, 0b1000)).toBe(true);
    expect(getBit(0b1010, 0b0100)).toBe(false);
  });

  it('setBit', () => {
    expect(setBit(0b1010, 0b0100)).toBe(0b1110);
    expect(setBit(0b1010, 0b1000)).toBe(0b1010);
  });

  it('clearBit', () => {
    expect(deleteBit(0b1010, 0b1000)).toBe(0b0010);
    expect(deleteBit(0b1010, 0b0100)).toBe(0b1010);
  });

  it('packTwoBits', () => {
    expect(packTwoBits(0x1234, 0x5678)).toBe(0x12_34_56_78);
  });

  it('unpackTwoBits', () => {
    const arr = packTwoBits(0x1234, 0x5678);
    expect(unpackTwoBits(arr)).toStrictEqual([0x1234, 0x5678]);
  });

  it('unpackTwoBitsFirst', () => {
    expect(unpackTwoBitsFirst(0x12_34_56_78)).toBe(0x1234);
  });

  it('unpackTwoBitsSecond', () => {
    expect(unpackTwoBitsSecond(0x12_34_56_78)).toBe(0x5678);
  });

  it('packThreeBits', () => {
    console.log(0x3FF, packThreeBits(0x3FF, 0x3FF, 0x3FF).toString(16));
    expect(packThreeBits(0x114, 0x51, 0x41)).toBe(0x11_41_44_41);
    expect(packThreeBits(0x3FF, 0x3FF, 0x3FF)).toBe(0x3F_FF_FF_FF);
  });

  it('unpackThreeBits', () => {
    const arr = packThreeBits(0x114, 0x51, 0x41);
    expect(unpackThreeBits(arr)).toStrictEqual([0x114, 0x51, 0x41]);
  });

  it('unpackThreeBitsFirst', () => {
    expect(unpackThreeBitsFirst(0x11_41_44_41)).toBe(0x114);
  });

  it('unpackThreeBitsSecond', () => {
    expect(unpackThreeBitsSecond(0x11_41_44_41)).toBe(0x51);
  });

  it('unpackThreeBitsThird', () => {
    expect(unpackThreeBitsThird(0x11_41_44_41)).toBe(0x41);
  });
});

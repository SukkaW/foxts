import { pack, unpack, unpackFirst, unpackSecond } from './index';
import expect from 'expect';

describe('bitwise', () => {
  it('pack', () => {
    expect(pack(0x1234, 0x5678)).toBe(0x12_34_56_78);
  });

  it('unpack', () => {
    const arr = pack(0x1234, 0x5678);
    expect(unpack(arr)).toStrictEqual([0x1234, 0x5678]);
  });

  it('unpackFirst', () => {
    expect(unpackFirst(0x12_34_56_78)).toBe(0x1234);
  });

  it('unpackSecond', () => {
    expect(unpackSecond(0x12_34_56_78)).toBe(0x5678);
  });
});

// From: https://stackoverflow.com/a/43122214/1185079
export function bitCount(n: number): number {
  n = n - ((n >> 1) & 0x55_55_55_55);
  n = (n & 0x33_33_33_33) + ((n >> 2) & 0x33_33_33_33);
  return (((n + (n >> 4)) & 0xF_0F_0F_0F) * 0x1_01_01_01) >> 24;
}

export function getBit(n: number, mask: number): boolean {
  return !!(n & mask);
}

export function setBit(n: number, mask: number): number {
  return n | mask;
}

export function deleteBit(n: number, mask: number): number {
  return n & ~mask;
}

/** Packs two 16-bit integers (0~65535) into one 32-bit integer */
export const packTwoBits = (a: number, b: number): number => (a << 16) | b;

export const unpackTwoBitsFirst = (value: number): number => (value >> 16) & 0xFFFF;
export const unpackTwoBitsSecond = (value: number): number => value & 0xFFFF;
/**
 * Unpacks two 16-bit integers (0~65535) from one 32-bit integer
 *
 * @param value - The 32-bit integer to unpack
 * @param arr - An optional array to store the unpacked values, useful if you are trying to re-use arrays
 */
export function unpackTwoBits(value: number, arr: [a: number, b: number] = Array.from(new Array(2).keys()) as any): [a: number, b: number] {
  arr[0] = unpackTwoBitsFirst(value);
  arr[1] = unpackTwoBitsSecond(value);
  return arr;
}

/** Packs three 10-bit integers (0~1023) into one 32-bit integer */
export const packThreeBits = (a: number, b: number, c: number): number => (a << 20) | (b << 10) | c;

export const unpackThreeBitsFirst = (value: number): number => (value >> 20) & 0x3FF;
export const unpackThreeBitsSecond = (value: number): number => (value >> 10) & 0x3FF;
export const unpackThreeBitsThird = (value: number): number => value & 0x3FF;
/**
 * Unpacks three 10-bit integers (0~1023) from one 32-bit integer
 *
 * @param value - The 32-bit integer to unpack
 * @param arr - An optional array to store the unpacked values, useful if you are trying to re-use arrays
 */
export function unpackThreeBits(value: number, arr: [a: number, b: number, c: number] = Array.from(new Array(3).keys()) as any): [a: number, b: number, c: number] {
  arr[0] = unpackThreeBitsFirst(value);
  arr[1] = unpackThreeBitsSecond(value);
  arr[2] = unpackThreeBitsThird(value);
  return arr;
}

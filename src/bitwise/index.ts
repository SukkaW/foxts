/** Packs two 16-bit integers into one 32-bit integer */
export const pack = (a: number, b: number): number => (a << 16) | b;

/**
 * Unpacks two 16-bit integers from one 32-bit integer
 *
 * @param value - The 32-bit integer to unpack
 * @param arr - An optional array to store the unpacked values, useful if you are trying to re-use arrays
 */
export function unpack(value: number, arr: [a: number, b: number] = Array.from(new Array(2).keys()) as any): [a: number, b: number] {
  arr[0] = (value >> 16) & 0xFFFF;
  arr[1] = value & 0xFFFF;
  return arr;
}

export const unpackFirst = (value: number): number => (value >> 16) & 0xFFFF;
export const unpackSecond = (value: number): number => value & 0xFFFF;

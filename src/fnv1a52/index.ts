import { __internal_hl_do_not_use__ as hl } from '../fnv1a';

/**
 * FNV-1a Hash implementation
 *
 * @author Sukka (sukkaw) <https://skk.moe>
 * @author Travis Webb (tjwebb) <me@traviswebb.com>
 *
 * @description
 *
 * Ported from https://github.com/tjwebb/fnv-plus/blob/master/index.js
 * Simplified, optimized and add modified for 52 bit, which provides a larger hash space
 * and still making use of Javascript's 53-bit integer space.
 *
 * DO NOT USE toString(16) here! Use `fnv1a52hex` instead, way faster
 */
export function fnv1a52(str: string) {
  const len = str.length;
  let i = 0,
    t0 = 0,
    v0 = 0x2325,
    t1 = 0,
    v1 = 0x8422,
    t2 = 0,
    v2 = 0x9CE4,
    t3 = 0,
    v3 = 0xCBF2;

  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = (t3 + (t2 >>> 16)) & 65535;
    v2 = t2 & 65535;
  }

  return (
    (v3 & 15) * 281_474_976_710_656
    + v2 * 4_294_967_296
    + v1 * 65536
    + (v0 ^ (v3 >> 4))
  );
}

const hl16 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

export function fnv1a52hex(str: string) {
  const len = str.length;
  let i = 0,
    t0 = 0,
    v0 = 0x2325,
    t1 = 0,
    v1 = 0x8422,
    t2 = 0,
    v2 = 0x9CE4,
    t3 = 0,
    v3 = 0xCBF2;

  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = (t3 + (t2 >>> 16)) & 65535;
    v2 = t2 & 65535;
  }

  return hl16[v3 & 15] + hl[v2 >> 8] + hl[v2 & 255] + hl[v1 >> 8] + hl[v1 & 255] + hl[(v0 >> 8) ^ (v3 >> 12)] + hl[(v0 ^ (v3 >> 4)) & 255];
}

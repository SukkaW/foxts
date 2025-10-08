export function fnv1a(str: string) {
  const l = str.length - 3;
  let i = 0, t0 = 0, v0 = 0x9DC5, t1 = 0, v1 = 0x811C;

  while (i < l) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 403; t1 = v1 * 403;
    t1 += v0 << 8;
    v1 = (t1 + (t0 >>> 16)) & 65535; v0 = t0 & 65535;
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 403; t1 = v1 * 403;
    t1 += v0 << 8;
    v1 = (t1 + (t0 >>> 16)) & 65535; v0 = t0 & 65535;
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 403; t1 = v1 * 403;
    t1 += v0 << 8;
    v1 = (t1 + (t0 >>> 16)) & 65535; v0 = t0 & 65535;
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 403; t1 = v1 * 403;
    t1 += v0 << 8;
    v1 = (t1 + (t0 >>> 16)) & 65535; v0 = t0 & 65535;
  }

  while (i < l + 3) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 403; t1 = v1 * 403;
    t1 += v0 << 8;
    v1 = (t1 + (t0 >>> 16)) & 65535; v0 = t0 & 65535;
  }

  return ((v1 << 16) >>> 0) + v0;
}

const hl: string[] = new Array(256);
for (let i = 0; i < 256; i++) {
  hl[i] = ((i >> 4) & 15).toString(16) + (i & 15).toString(16);
}

export const __internal_hl_do_not_use__ = hl;

export function fnv1ahex(str: string) {
  const l = str.length - 3;
  let i = 0, t0 = 0, v0 = 0x9DC5, t1 = 0, v1 = 0x811C;

  while (i < l) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 403; t1 = v1 * 403;
    t1 += v0 << 8;
    v1 = (t1 + (t0 >>> 16)) & 65535; v0 = t0 & 65535;
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 403; t1 = v1 * 403;
    t1 += v0 << 8;
    v1 = (t1 + (t0 >>> 16)) & 65535; v0 = t0 & 65535;
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 403; t1 = v1 * 403;
    t1 += v0 << 8;
    v1 = (t1 + (t0 >>> 16)) & 65535; v0 = t0 & 65535;
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 403; t1 = v1 * 403;
    t1 += v0 << 8;
    v1 = (t1 + (t0 >>> 16)) & 65535; v0 = t0 & 65535;
  }

  while (i < l + 3) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 403; t1 = v1 * 403;
    t1 += v0 << 8;
    v1 = (t1 + (t0 >>> 16)) & 65535; v0 = t0 & 65535;
  }

  return hl[(v1 >>> 8) & 255] + hl[v1 & 255] + hl[(v0 >>> 8) & 255] + hl[v0 & 255];
}

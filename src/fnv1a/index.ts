export function fnv1a(s: string) {
  let h = 0x81_1C_9D_C5;

  for (let i = 0, l = s.length; i < l; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }

  return (h >>> 0);
}

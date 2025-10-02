/**
 * This is an alternative to `String.prototype.localeCompare`, but way more performant.
 *
 * `String#localeCompare` is slow because it supports internationalization (e.g. `Intl.Collator`).
 * But if you are only working with ASCII-only characters, this function will produce the same result
 * as `String#localeCompare` with en-US settings, but much faster.
 *
 * This function is expected to be used as a sorter callback for `Array#sort`, `Array#toSorted`, and similar functions.
 */
export function fastStringCompare(a: string, b: string) {
  const lenA = a.length;
  const lenB = b.length;
  const minLen = lenA < lenB ? lenA : lenB;

  let tmp = 0;

  for (let i = 0; i < minLen; ++i) {
    const ca = a.charCodeAt(i);
    const cb = b.charCodeAt(i);

    tmp = ca - cb;
    if (tmp !== 0) {
      return tmp;
    }
  }

  if (lenA === lenB) {
    return 0;
  }

  return lenA > lenB ? 1 : -1;
};

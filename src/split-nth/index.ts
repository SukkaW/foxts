/**
 * Get the `index`-th segment of `str.split(sep)` without creating the
 * intermediate array, using `String.prototype.indexOf` and `String.prototype.slice`.
 *
 * Matches `str.split(sep)[index]` behavior (string separator only, no regex):
 *
 * - `splitNth('a,b', ',', 5)` returns `undefined` (out of range)
 * - `splitNth('', ',', 0)` returns `''` (`''.split(',')` is `['']`)
 * - `splitNth('abc', '', 1)` returns `'b'` (empty separator splits into UTF-16 code units)
 * - `splitNth('', '', 0)` returns `undefined` (`''.split('')` is `[]`)
 *
 * @example
 * ```ts
 * splitNth('foo\nbar\nbaz', '\n', 0); // 'foo', same as 'foo\nbar\nbaz'.split('\n')[0]
 * splitNth('foo\nbar\nbaz', '\n', 2); // 'baz'
 * ```
 *
 * On a 64-line (~2 KB) string (see `index.bench.ts`): ~5x faster than
 * `split(sep, 1)[0]` and ~110x faster than `split(sep)[0]`; ~2x / ~28x for
 * `[2]`; ~1.6x for the last segment, allocating 0 bytes vs ~2.5 KB per call.
 * The win shrinks as `index` grows, since cost is proportional to how deep
 * into the string the segment sits.
 */
export function splitNth(str: string, sep: string, index: number): string | undefined {
  if (index < 0 || !Number.isSafeInteger(index)) {
    return undefined;
  }

  // ''.split('') is [], 'abc'.split('') splits into UTF-16 code units
  if (sep === '') {
    return str[index];
  }

  let start = 0;

  // skip the first `index` segments
  for (let i = 0; i < index; i++) {
    const found = str.indexOf(sep, start);
    if (found === -1) {
      return undefined;
    }
    start = found + sep.length;
  }

  const end = str.indexOf(sep, start);
  return end === -1 ? str.slice(start) : str.slice(start, end);
}

/**
 * Get everything before the first occurrence of `sep`, or the whole string if
 * `sep` is not found. Same as `str.split(sep)[0]` (with non-empty string `sep`),
 * without creating the intermediate array.
 *
 * On a 64-line (~2 KB) string (see `index.bench.ts`): ~5x faster than
 * `split(sep, 1)[0]` and ~110x faster than `split(sep)[0]`.
 */
export function splitFirst(str: string, sep: string): string {
  const end = str.indexOf(sep);
  return end === -1 ? str : str.slice(0, end);
}
export const split0th = splitFirst;

/**
 * Get the segment between the first and the second occurrence of `sep`, or
 * `undefined` if `sep` is not found. Same as `str.split(sep)[1]` (with
 * non-empty string `sep`), without creating the intermediate array.
 *
 * On a 64-line (~2 KB) string (see `index.bench.ts`): ~2.7x faster than
 * `split(sep, 2)[1]` and ~47x faster than `split(sep)[1]`.
 */
export function splitSecond(str: string, sep: string): string | undefined {
  const first = str.indexOf(sep);
  if (first === -1) {
    return undefined;
  }
  const start = first + sep.length;
  const end = str.indexOf(sep, start);
  return end === -1 ? str.slice(start) : str.slice(start, end);
}
export const split1st = splitSecond;

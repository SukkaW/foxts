/**
 * A 200% faster join than the native `Array.prototype.join` for string arrays and string separator.
 */
export function fastStringArrayJoin(arr: string[] | readonly string[], sep: string) {
  const len = arr.length;
  if (len === 0) {
    return '';
  }

  let result = arr[0];

  for (let i = 1; i < len; i++) {
    result += sep;
    result += arr[i];
  }

  return result;
}

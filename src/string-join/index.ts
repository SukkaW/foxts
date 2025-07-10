export function stringJoin(arr: Array<string | null | undefined | false | 0>, sep = ',', dedupe = false): string {
  if (arr.length === 0) {
    return '';
  }

  if (dedupe) {
    arr = Array.from(new Set(arr));
  }

  const len = arr.length;

  let result = '';
  let item;

  for (let i = 0; i < len - 1; i++) {
    item = arr[i];
    if (item) {
      result += item;
      result += sep;
    }
  }

  item = arr[len - 1];
  if (item) {
    result += item;
  }

  return result;
}

export function stringJoin(arr: Array<string | null | undefined | false | 0>, sep = ',', dedupe = false): string {
  const len = arr.length;

  if (len === 0) {
    return '';
  }

  if (dedupe) {
    arr = Array.from(new Set(arr));
  }

  let result = '';

  let sep_flag = false;
  let item: string | null | undefined | false | 0;

  for (let i = 0; i < len; i++) {
    item = arr[i];

    if (item) {
      if (sep_flag) {
        result += sep;
      } else {
        sep_flag = true;
      }
      result += item;
    }
  }

  return result;
}

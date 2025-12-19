export function stringJoin(arr: Array<string | null | undefined | false | 0>, sep = ',', dedupe = false): string {
  let len = arr.length;

  if (len === 0) {
    return '';
  }

  if (dedupe) {
    arr = Array.from(new Set(arr));
    len = arr.length;
  }

  let result = '';

  let sep_flag = 0;
  let item: string | null | undefined | false | 0;

  for (let i = 0; i < len; i++) {
    item = arr[i];

    if (item) {
      if (sep_flag) {
        result += sep;
      } else {
        sep_flag = 1;
      }
      result += item;
    }
  }

  return result;
}

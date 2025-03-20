import { fastStringArrayJoin } from '../fast-string-array-join';
import { isNonNullish } from '../guard';

export function stringJoin(arr: Array<string | null | undefined>, sep = ',', dedupe = false): string {
  if (dedupe) {
    arr = Array.from(new Set(arr));
  }
  return fastStringArrayJoin(arr.filter(isNonNullish), sep);
}

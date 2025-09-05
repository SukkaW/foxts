export interface ShuffleArrayOptions {
  copy?: boolean,
  random?: () => number
}

export function shuffleArray<T>(arr: T[], options: ShuffleArrayOptions = {}): T[] {
  const { copy = false, random = Math.random } = options;

  const result = copy ? arr.slice() : arr;

  let j = 0;
  let tmp: T;

  let c = result.length;
  while (c) {
    j = random() * c-- | 0;

    // This looks nice, but in the end this creates intermediate arrays
    // [result[i], result[j]] = [result[j], result[i]];

    tmp = result[c];
    result[c] = result[j];
    result[j] = tmp;
  }

  return result;
}

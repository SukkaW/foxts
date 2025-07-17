import { createRandomInt } from '../random-int';

export interface ShuffleArrayOptions {
  copy?: boolean,
  random?: () => number
}

export function shuffleArray<T>(arr: T[], options: ShuffleArrayOptions = {}): T[] {
  const { copy = false, random = Math.random } = options;

  const result = copy ? arr.slice() : arr;

  const randomInt = createRandomInt(random);

  let j = 0;
  let tmp: T;

  for (let i = result.length - 1; i > 0; i--) {
    j = randomInt(0, i);

    // This looks nice, but in the end this creates intermediate arrays
    // [result[i], result[j]] = [result[j], result[i]];

    tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }

  return result;
}

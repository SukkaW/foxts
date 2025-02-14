import { randomInt } from 'node:crypto';
import { randomIntSecure } from '../random-int';

/**
 * @param randomInt - a random generate function that accepts two arguments `min` and `max` and returns a random number between `min` and `max`
 */
export function createPickRandom(randomInt: (min: number, max: number) => number) {
  return function pickRandom<T>(data: T[] | readonly T[], count = 1) {
    if (count > data.length) {
      throw new TypeError('Count must be lower or the same as the number of picks');
    }

    const $data = data.slice();

    const pickedElements = [];

    while (count--) {
      if ($data.length === 1) {
        // skip randomInt since it might be expensive
        pickedElements.push($data[0]);
      } else {
        pickedElements.push($data.splice(randomInt(0, $data.length - 1), 1)[0]);
      }
    }

    return pickedElements;
  };
}

export const pickRandom = createPickRandom(randomInt);
export const pickRandomSecure = createPickRandom(randomIntSecure);

export function createPickOne(randomInt: (min: number, max: number) => number) {
  return function pickOne<T>(data: T[] | readonly T[]) {
    if (data.length === 1) {
      // skip randomInt since it might be expensive
      return data[0];
    }
    return data[randomInt(0, data.length - 1)];
  };
}

export const pickOne = createPickOne(randomInt);

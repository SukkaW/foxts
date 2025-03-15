/**
 * @param random - a random generate function that returns a number between 0 and 1
 */
export function createRandomInt(random: () => number) {
  return (min: number, max: number): number => Math.floor(random() * (max - min + 1)) + min;
}

export const randomInt = createRandomInt(Math.random);

// function secureRandom() {
//   const buf = new Uint32Array(1);
//   getRandomValues(buf);
//   return buf[0] / (0xFF_FF_FF_FF + 1);
// }

// export const randomIntSecure = createRandomInt(secureRandom);

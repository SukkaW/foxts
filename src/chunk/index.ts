export function chunk<T>(arr: readonly T[], size: number): T[][] {
  // if (!Number.isInteger(size) || size <= 0) {
  //   throw new Error("Size must be an integer greater than zero.");
  // }

  const chunkLength = Math.ceil(arr.length / size);

  const result: T[][] = new Array(chunkLength);

  let start = 0;
  let end = 0;

  for (let index = 0; index < chunkLength; index++) {
    start = index * size;
    end = start + size;

    result[index] = arr.slice(start, end);
  }

  return result;
}

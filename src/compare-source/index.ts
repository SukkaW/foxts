import { invariant } from '../guard';

export function createCompareSource<T>(callback: (a: T, b: T) => boolean = Object.is) {
  return async function compareSource(
    source: T[],
    target: Iterable<T> | AsyncIterable<T>
  ) {
    if (source.length === 0) {
      return false;
    }

    const sourceLen = source.length;

    const maxSourceIndex = sourceLen - 1;
    let index = -1;

    const iterator = Symbol.asyncIterator in target
      ? target[Symbol.asyncIterator]()
      : (
        Symbol.iterator in target
          ? target[Symbol.iterator]()
          : null
      );

    invariant(iterator, 'source must be iterable or async iterable');

    let result = await iterator.next();

    // If the iterator is already done before starting, index remains -1
    if (!result.done) {
      let b: T = result.value;

      do {
        index++;

        // b become bigger
        if (index === sourceLen) {
          return false;
        }

        const a = source[index];

        if (!callback(a, b)) {
          return false;
        }

        // eslint-disable-next-line no-await-in-loop -- sequential
        result = await iterator.next();
        b = result.value;
      } while (!result.done);
    }

    // b is not smaller than a
    return index === maxSourceIndex;
  };
}

export async function compareSource<T>(
  source: T[],
  target: Iterable<T> | AsyncIterable<T>,
  callback: (a: T, b: T) => boolean = Object.is
) {
  return createCompareSource(callback)(source, target);
}

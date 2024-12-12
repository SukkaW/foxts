import { identity } from '../identity';

function innerAppendSetElementsToArray<T>(
  dest: T[],
  source: Set<T>,
  transformer: (item: T) => T
): T[] {
  const iterator = source.values();
  let step: IteratorResult<T, undefined>;

  while ((step = iterator.next(), !step.done)) {
    dest.push(transformer(step.value));
  }

  return dest;
}

export function appendSetElementsToArray<T>(
  dest: T[],
  source: Set<T> | Array<Set<T>>,
  transformer: (item: T) => T = identity
) {
  if (!Array.isArray(source)) {
    return innerAppendSetElementsToArray(dest, source, transformer);
  }

  for (let i = 0, len = source.length; i < len; i++) {
    innerAppendSetElementsToArray(dest, source[i], transformer);
  }

  return dest;
}

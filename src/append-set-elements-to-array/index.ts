import { identity } from '../identity';

export function appendSetElementsToArray<T>(dest: T[], source: Set<T> | Array<Set<T>>, transformer: (item: T) => T = identity) {
  const casted = Array.isArray(source) ? source : [source];
  for (let i = 0, len = casted.length; i < len; i++) {
    const iterator = casted[i].values();
    let step: IteratorResult<T, undefined>;

    while ((step = iterator.next(), !step.done)) {
      dest.push(transformer(step.value));
    }
  }

  return dest;
}

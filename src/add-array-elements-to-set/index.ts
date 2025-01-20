import { identity } from '../identity';

export function addArrayElementsToSet<T>(set: Set<T>, arr: T[], transformer: (item: T) => T = identity): Set<T> {
  const add = (item: T) => set.add(transformer(item));
  arr.forEach(add);
  return set;
}

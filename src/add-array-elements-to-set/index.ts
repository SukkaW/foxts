export function addArrayElementsToSet<T>(set: Set<T>, arr: T[]): Set<T> {
  // eslint-disable-next-line @typescript-eslint/unbound-method -- thisArg is passed
  arr.forEach(set.add, set);
  return set;
}

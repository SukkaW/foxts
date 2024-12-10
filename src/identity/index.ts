export function identity<T = any, R = T>(item: T): R {
  return item as any;
}

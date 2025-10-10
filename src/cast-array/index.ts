export function castArray<T>(value?: T | T[] | null): T[] {
  value ??= [];
  return Array.isArray(value) ? value : [value];
}

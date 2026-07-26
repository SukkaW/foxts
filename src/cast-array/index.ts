/* eslint-disable sukka/prefer-foxts-cast-array -- This is foxts/cast-array itself */
export function castArray<T>(value?: T | T[] | null): T[] {
  value ??= [];
  return Array.isArray(value) ? value : [value];
}

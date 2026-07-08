export function isObjectEmpty(obj: Record<string, unknown>): boolean {
  for (const key in obj) {
    // eslint-disable-next-line prefer-object-has-own -- backward compatibility for older environments
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

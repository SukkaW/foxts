export function once<T>(fn: (() => T), prewarm = true): (() => T) {
  let called = false;
  let result: T;

  if (prewarm) {
    result = fn();
    return () => result;
  }

  return (): T => {
    if (!called) {
      called = true;
      result = fn();
    }

    return result;
  };
}

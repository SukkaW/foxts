export function once<T>(fn: (() => T), prewarm = true): (() => T) {
  let result: T;

  if (prewarm) {
    result = fn();
    return () => result;
  }

  let called = false;

  return (): T => {
    if (!called) {
      called = true;
      result = fn();
    }

    return result;
  };
}

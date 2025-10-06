type FalsyValue = null | undefined | false | '' | 0 | void;

type TruthyValue =
  | object
  | unknown[]
  | symbol
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- any function value is truthy value
  | Function
  | Exclude<number, 0>
  | Exclude<string, ''>
  | true;

export type CleanupFn = () => void;
export type OnCleanup = (cleanUpFn: CleanupFn) => void;
export type Scheduler = (callback: () => Promise<void>, onCleanup: OnCleanup) => void | CleanupFn;
export type Predicate<T extends TruthyValue> = () => T | FalsyValue | Promise<T> | Promise<FalsyValue>;

export function waitUntil<T extends TruthyValue>(
  predicate: Predicate<T>,
  scheduler: Scheduler,
  abortSignal?: AbortSignal | null,
): Promise<T>;
export function waitUntil<T extends TruthyValue>(
  predicate: Predicate<T>,
  checkInterval?: number,
  abortSignal?: AbortSignal | null
): Promise<T>;
export function waitUntil<T extends TruthyValue>(
  predicate: Predicate<T>,
  abortSignal: AbortSignal,
): Promise<T>;
export function waitUntil<T extends TruthyValue>(
  predicate: Predicate<T>,
  scheduler: AbortSignal | Scheduler | number = 50,
  abortSignal: AbortSignal | never | null = null
): Promise<T> {
  if (typeof scheduler === 'object' && 'aborted' in scheduler) {
    abortSignal = scheduler;
    scheduler = 50;
  }
  if (typeof scheduler === 'number') {
    const timeout = scheduler;
    scheduler = (callback, onCleanup) => {
      const intervalHandle = setTimeout(callback, timeout);
      onCleanup(() => clearTimeout(intervalHandle));
    };
  }

  abortSignal ??= AbortSignal.timeout(5000);

  const cleanUp = new Set<() => void>();
  const onCleanup: OnCleanup = (fn) => cleanUp.add(fn);

  const promise = new Promise<T>((resolve, reject) => {
    const check = async () => {
      try {
        abortSignal.throwIfAborted();

        const value = await predicate();
        if (value) {
          resolve(value);
          return;
        }

        const cleanup = scheduler(check, onCleanup);
        if (typeof cleanup === 'function') {
          cleanUp.add(cleanup);
        }
      } catch (err) {
        reject(err as Error);
      }
    };
    void check();
  });

  return promise.finally(() => {
    cleanUp.forEach((fn) => fn());
  });
}

export interface Noop<T = any> {
  (...args: any[]): T
}
export const noop: Noop = () => { /* noop */ };

export const trueFn: Noop<true> = () => true;
export const falseFn: Noop<false> = () => false;

// eslint-disable-next-line sukka/unicorn/error-message -- deliberately w/o error msg
export const throwFn: Noop<never> = () => { throw new Error(); };

const p = Promise.resolve();
export const asyncNoop: Noop<Promise<any>> = () => p;

const neverResolvedPromise = new Promise<never>(noop);
export const asyncNeverFn: Noop<Promise<never>> = () => neverResolvedPromise;

export interface Noop<T = any> {
  (...args: any[]): T
}
export const noop: Noop = /* @__NO_SIDE_EFFECTS__ */() => { /* noop */ };

export const trueFn: Noop<true> = /* @__NO_SIDE_EFFECTS__ */() => true;
export const falseFn: Noop<false> = /* @__NO_SIDE_EFFECTS__ */() => false;

// eslint-disable-next-line sukka/unicorn/error-message -- deliberately w/o error msg
export const throwFn: Noop<never> = /* @__NO_SIDE_EFFECTS__ */() => { throw new Error(); };

const p = /* #__PURE__ */Promise.resolve();
export const asyncNoop: Noop<Promise<any>> = /* @__NO_SIDE_EFFECTS__ */() => p;

const neverResolvedPromise = /* #__PURE__ */new Promise<never>(noop);
export const asyncNeverFn: Noop<Promise<never>> = /* @__NO_SIDE_EFFECTS__ */() => neverResolvedPromise;

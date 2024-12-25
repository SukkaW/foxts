export interface Noop<T = any> {
  (...args: any[]): T
}
export const noop: Noop = () => { /* noop */ };

export const trueFn: Noop<true> = () => true;
export const falseFn: Noop<false> = () => false;

// eslint-disable-next-line sukka/unicorn/error-message -- deliberately w/o error msg
export const throwFn: Noop<never> = () => { throw new Error(); };

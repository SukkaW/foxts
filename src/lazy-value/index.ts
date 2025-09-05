import { once } from '../once';

export type LazyValue<T> = () => Readonly<T>;
export const lazyValue = once as <T>(cb: () => T) => LazyValue<T>;

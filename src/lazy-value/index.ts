import { once } from '../once';

export type LazyValue<T> = () => Readonly<T>;
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- output types
export const lazyValue = once as <T>(cb: () => T) => LazyValue<T>;

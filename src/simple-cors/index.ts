import type { CorsOptions } from 'cors-edge';
import { createCors } from 'cors-edge';

/** @deprecated install `cors-edge` package directly instead, this will be removed in the next major version */
export type SimpleCorsOptions = CorsOptions;
/** @deprecated install `cors-edge` package directly instead, this will be removed in the next major version */
// eslint-disable-next-line sukka/unicorn/prefer-export-from -- deprecated re-export
export const createSimpleCors = createCors;

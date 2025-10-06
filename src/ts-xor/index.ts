import type { EvalIfNotUnknown, Prettify, Without } from './_utils';

/**
 * Restrict using either exclusively the keys of `T` or exclusively the keys of `U`.
 *
 * No unique keys of `T` can be used simultaneously with any unique keys of `U`.
 *
 * @example
 * ```ts
 * const myVar: XOR<{ data: object }, { error: object }>
 * ```
 *
 * Supports from 2 up to 8 generic parameters.
 *
 * More: https://github.com/maninak/ts-xor/tree/master#description
 *  */

export type XOR<A, B, C = unknown, D = unknown, E = unknown, F = unknown, G = unknown, H = unknown> = Prettify<(Without<B & C & D & E & F & G & H, A> & A) | (Without<A & C & D & E & F & G & H, B> & B) | EvalIfNotUnknown<C, Without<A & B & D & E & F & G & H, C> & C> | EvalIfNotUnknown<D, Without<A & B & C & E & F & G & H, D> & D> | EvalIfNotUnknown<E, Without<A & B & C & D & F & G & H, E> & E> | EvalIfNotUnknown<F, Without<A & B & C & D & E & G & H, F> & F> | EvalIfNotUnknown<G, Without<A & B & C & D & E & F & H, G> & G> | EvalIfNotUnknown<H, Without<A & B & C & D & E & F & G, H> & H>>;

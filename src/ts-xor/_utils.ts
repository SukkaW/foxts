/**
 * Skip evaluating `U` if `T` is `unknown`.
 */
export type EvalIfNotUnknown<T, U> = unknown extends T ? never : U;

/**
 * Resolve mapped types and show the derived keys and their types when hovering in
 * VS Code, instead of just showing the names those mapped types are defined with.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {};

/**
 * Get the keys of T without any keys of U.
 */
export type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never
};

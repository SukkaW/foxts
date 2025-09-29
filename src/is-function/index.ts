/** This type utility is only used for workaround https://github.com/microsoft/TypeScript/issues/37663 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- any function would do
export const isFunction = (x: unknown): x is Function => typeof x === 'function';

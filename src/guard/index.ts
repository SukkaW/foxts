const $not_null = <T>(i: T | null): i is T => i !== null;
const $not_undefined = <T>(i: T | undefined): i is T => i !== undefined;
const $not_false = <T>(i: T | false): i is T => i !== false;
const $not_nullish = <T>(i: T | null | undefined): i is T => i != null;
const $not_falsy = <T>(i: T | 0 | '' | false | null | undefined): i is T => !!i;

export function not(arg: null): <T>(i: T | null) => i is T;
export function not(arg: undefined): <T>(i: T | undefined) => i is T;
export function not(arg: false): <T>(i: T | false) => i is T;
export function not(arg: 'nullish'): <T>(i: T | null | undefined) => i is T;
export function not(arg: 'falsy'): <T>(i: T | 0 | '' | false | null | undefined) => i is T;
export function not(arg: null | undefined | false | 'nullish' | 'falsy') {
  switch (arg) {
    case null:
      return $not_null;
    case undefined:
      return $not_undefined;
    case false:
      return $not_false;
    case 'nullish':
      return $not_nullish;
    case 'falsy':
      return $not_falsy;
    default:
      never(arg, 'argument');
  }
}

const $is_null = (i: unknown): i is null => i === null;
const $is_undefined = (i: unknown): i is undefined => i === undefined;
const $is_false = (i: unknown): i is false => i === false;
const $is_nullish = (i: unknown): i is null | undefined => i == null;
const $is_falsy = (i: unknown): i is 0 | '' | false | null | undefined => !i;
const $is_truthy = <T>(i: T | 0 | '' | false | null | undefined): i is T => !!i;

export function is(arg: null): (i: unknown) => i is null;
export function is(arg: undefined): (i: unknown) => i is undefined;
export function is(arg: false): (i: unknown) => i is false;
export function is(arg: 'nullish'): (i: unknown) => i is null | undefined;
export function is(arg: 'falsy'): (i: unknown) => i is 0 | '' | false | null | undefined;
export function is(arg: 'truthy'): <T>(i: T | 0 | '' | false | null | undefined) => i is T;
export function is(arg: null | undefined | false | 'nullish' | 'falsy' | 'truthy') {
  switch (arg) {
    case null:
      return $is_null;
    case undefined:
      return $is_undefined;
    case false:
      return $is_false;
    case 'nullish':
      return $is_nullish;
    case 'falsy':
      return $is_falsy;
    case 'truthy':
      return $is_truthy;
    default:
      never(arg, 'argument');
  }
}

export const isTruthy = $is_truthy;
export const isFalsy = $is_falsy;
export const isNonNull = $not_null;
export const isNonNullish = $not_nullish;

export function nullthrow<T>(value: T | null | undefined, message = '[foxts/invariant] "value" is null or undefined'): T {
  if (value === null || value === undefined) {
    throw new TypeError(message);
  }
  return value;
}

export function invariant<T>(value: T | null | undefined, message = '[foxts/invariant] "value" is null or undefined'): asserts value is T {
  if (value === null || value === undefined) {
    throw new TypeError(message);
  }
}

export function never(value: never, valueMetaName = 'value'): never {
  throw new TypeError(`Unexpected ${valueMetaName}: ${value} as ${JSON.stringify(typeof value)}, should be "never"`);
}

export function not(arg: null): <T>(i: T | null) => i is T;
export function not(arg: undefined): <T>(i: T | undefined) => i is T;
export function not(arg: false): <T>(i: T | false) => i is T;
export function not(arg: 'nullish'): <T>(i: T | null | undefined) => i is T;
export function not(arg: 'falsy'): <T>(i: T | 0 | '' | false | null | undefined) => i is T;
export function not(arg: null | undefined | false | 'nullish' | 'falsy') {
  switch (arg) {
    case null:
      return <T>(i: T | null): i is T => i !== null;
    case undefined:
      return <T>(i: T | undefined): i is T => i !== undefined;
    case false:
      return <T>(i: T | false): i is T => i !== false;
    case 'nullish':
      return <T>(i: T | null | undefined): i is T => i != null;
    case 'falsy':
      return <T>(i: T | 0 | '' | false | null | undefined): i is T => !!i;
    default:
      never(arg, 'argument');
  }
}

export function is(arg: null): (i: unknown) => i is null;
export function is(arg: undefined): (i: unknown) => i is undefined;
export function is(arg: false): (i: unknown) => i is false;
export function is(arg: 'nullish'): (i: unknown) => i is null | undefined;
export function is(arg: 'falsy'): (i: unknown) => i is 0 | '' | false | null | undefined;
export function is(arg: 'truthy'): <T>(i: T | 0 | '' | false | null | undefined) => i is T;
export function is(arg: null | undefined | false | 'nullish' | 'falsy' | 'truthy') {
  switch (arg) {
    case null:
      return (i: unknown): i is null => i === null;
    case undefined:
      return (i: unknown): i is undefined => i === undefined;
    case false:
      return (i: unknown): i is false => i === false;
    case 'nullish':
      return (i: unknown): i is null | undefined => i == null;
    case 'falsy':
      return (i: unknown): i is 0 | '' | false | null | undefined => !i;
    case 'truthy':
      return <T>(i: T | 0 | '' | false | null | undefined): i is T => !!i;
    default:
      never(arg, 'argument');
  }
}

export const isTruthy = is('truthy');
export const isFalsy = is('falsy');
export const isNonNull = not(null);
export const isNonNullish = not('nullish');

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

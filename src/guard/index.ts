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
      return <T>(i: T | 0 | '' | false | null | undefined): i is T => !i;
    default:
      throw new TypeError('Invalid argument');
  }
}

export const isTruthy = not('falsy');
export const isFalsy = <T>(i: T | 0 | '' | false | null | undefined): i is 0 | '' | false | null | undefined => !i;
export const isNonNull = not(null);
export const isNonNullish = not('nullish');

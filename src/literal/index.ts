type DeepMutable<T> = {
  -readonly [P in keyof T]: DeepMutable<T[P]>;
};

/**
 * When you are returning some object/array literal from a function,
 * TypeScript automatically widens the array to be more general, like
 * ['sukka'] becomes string[].
 *
 * TypeScript does this to allow returned arrays to be extensible,
 * but it may break the type inference.
 *
 * You can use `foxts/literal` to wrap your array to prevent TypeScript
 * from widening the type in function return values.
 *
 * Playground Link: https://www.typescriptlang.org/play/?declaration=false&jsx=0#code/C4TwDgpgBAIhFgLIFdgEMBGAbCAeAKgHxQC8UA3gFBRQC0AThGgCYD2AdliFANoAKUAJbsoAawghWAMyj4AugC5Y8JKkw4C-OYQDclAL56IADzCt6wKAGMOAZ0tZBwCPTRZSUXDfb3ZhABQAbkr4AJRKcAgo6Nh4RKTEgXqUoJBQAMrowMi2APIYAFYQVpZk5FD2aNm2SgCC9K4guADkrKLNUAA+UK2sYLbNxIaUUsjsJYIc1gAWxaL+wmCoSplVOflFJaEU1nasOAB0WKwA5gvsS8Dbw5RWs1bz5ZXVSjyt7XJQ+qHJ3r4YHn82xIxH8TyyOVe72an2+egA9PCoMBpoJbFAONAAO6CLDuKRoXG3e7zDBAn6UW52SxWQHA0HgtY1KCOZyuLD+N5tGHXCl3Ob+KzkvRAA
 */
export const literal = <const T>(v: T): DeepMutable<T> => v;

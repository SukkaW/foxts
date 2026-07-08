/**
 * Ponyfill for the TC39 "Property Counting" proposal.
 *
 * @see https://github.com/tc39/proposal-object-property-count
 */

/**
 * Counts own, enumerable, string-keyed properties (including array indices).
 *
 * Equivalent to `Object.keys(target).length`, but without allocating the
 * intermediate array.
 */
export function keysLength(target: object): number {
  let count = 0;
  for (const key in target) {
    // eslint-disable-next-line prefer-object-has-own -- backward compatibility for older environments
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      count++;
    }
  }
  return count;
}

/**
 * Counts own, string-keyed properties (including array indices), both
 * enumerable and non-enumerable.
 *
 * There is no allocation-free reflection primitive for this, so it delegates to
 * `Object.getOwnPropertyNames(target).length`.
 */
export function getOwnPropertyNamesLength(target: object): number {
  return Object.getOwnPropertyNames(target).length;
}

/**
 * Counts own, symbol-keyed properties, regardless of enumerability.
 *
 * There is no allocation-free reflection primitive for this, so it delegates to
 * `Object.getOwnPropertySymbols(target).length`.
 */
export function getOwnPropertySymbolsLength(target: object): number {
  return Object.getOwnPropertySymbols(target).length;
}

/**
 * The only use case I have think of so far would be @typescript-eslint/await-thenable banning
 *
 * `await Promise.all(Array<Promise | null | undefined>)`
 *
 * So instead of `.filter(not('nullish'))` which need to iterate through array, we use this when pushing
 * things to array in the first place
 */
export function arrayPushNonNullish<T>(arr: T[], itemOrItems: T | null | undefined | Array<T | null | undefined>): void {
  if (Array.isArray(itemOrItems)) {
    for (let i = 0, len = itemOrItems.length; i < len; i++) {
      const item = itemOrItems[i];
      if (item !== null && item !== undefined) {
        arr.push(item);
      }
    }
  } else if (itemOrItems !== null && itemOrItems !== undefined) {
    arr.push(itemOrItems);
  }
}

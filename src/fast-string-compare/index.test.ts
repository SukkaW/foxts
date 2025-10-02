import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { describe, it } from 'mocha';
import { expect } from 'expect';

import { fastStringCompare } from '.';
import { shuffleArray } from '../shuffle-array';

import wordListPath from 'word-list';

const defaultCompare = (a: string, b: string) => a.localeCompare(b);

describe('fast-string-compare', () => {
  it('should do the same as localeCompare for english', async () => {
    const words = shuffleArray(await Array.fromAsync(createInterface({ crlfDelay: Infinity, input: createReadStream(wordListPath) }))).slice(0, 5000);
    // Add some duplicates
    words.splice(2000, 0, ...words.slice(100, 500));

    const reshuffled = shuffleArray(words, { copy: true });

    const sort1 = words.toSorted(defaultCompare);
    const sort2 = words.toSorted(fastStringCompare);
    const sort3 = reshuffled.sort(fastStringCompare);

    expect(sort2).toStrictEqual(sort3);

    const sort2locale = sort2.toSorted(defaultCompare);

    expect(sort2locale).toStrictEqual(sort1);
  });
});

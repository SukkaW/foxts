import { describe, it } from 'mocha';
import { expect } from 'expect';
import { createAhoCorasick } from '.';

describe('AhoCorasick', () => {
  it('should work', () => {
    for (const test of ([
      [
        ['ap', 'an'],
        ['bananan', 'apple', 'melon'],
        [true, true, false]
      ],
      [
        ['cdn', 'sukka'],
        ['bananan', 'apple', 'melon'],
        [false, false, false]
      ]
    ] as const)) {
      const kwtest = createAhoCorasick(test[0]);
      const fixtures = test[1];
      const expected = test[2];

      for (let i = 0, len = fixtures.length; i < len; i++) {
        expect(kwtest(fixtures[i])).toBe(expected[i]);
      }
    }
  });
});

import { describe, it } from 'mocha';
import { expect } from 'expect';
import { retrie } from '.';

describe('retrie', () => {
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
      const kwtest = retrie(test[0]).toRe();
      const fixtures = test[1];
      const expected = test[2];

      console.log({ kwtest });

      for (let i = 0, len = fixtures.length; i < len; i++) {
        expect(kwtest.test(fixtures[i])).toBe(expected[i]);
      }
    }
  });
});

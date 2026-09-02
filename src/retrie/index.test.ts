import { describe, it } from 'mocha';
import { expect } from 'earl';
import { retrie, createRetrieKeywordFilter } from '.';

describe('retrie', () => {
  describe('retrie', () => {
    const tests = [
      [
        ['ap', 'an'],
        ['bananan', 'apple', 'melon'],
        [true, true, false]
      ],
      [
        ['cdn', 'sukka'],
        ['bananan', 'apple', 'melon'],
        [false, false, false]
      ],
      [
        ['google-'],
        ['google.com', 'google-analytics.com'],
        [false, true]
      ],
      [
        [
          'transactions-',
          'payment',
          'wallet',
          '-transactions',
          '-faceb', // facebook fake
          '.faceb', // facebook fake
          'facebook',
          'virus-',
          'icloud-',
          'apple-',
          '-roblox',
          '-co-jp',
          'customer.',
          'customer-',
          '.www-',
          '.www.',
          '.www2',
          'instagram',
          'microsof',
          'passwordreset',
          '.google-',
          'recover',
          'banking'
        ],
        ['paymentfake.com', 'a.www.fake.com'],
        [true, true]
      ],
      [
        ['!', '?', '*', '[', '(', ']', ')', ',', '#', '%', '&', '=', '~'],
        ['! hello', '!||sso.internetat.tv^ # Account login'],
        [true, true]
      ],
      [
        ['.ts', '.tsx'],
        ['index.ts', 'index.tsx', 'index.jsx'],
        [true, true, false]
      ]
    ] as const;

    for (let i = 0, len = tests.length; i < len; i++) {
      const test = tests[i];
      it(JSON.stringify(test[0]), () => {
        const kwtest = retrie(test[0]);
        const fixtures = test[1];
        const expected = test[2];

        for (let j = 0, len2 = fixtures.length; j < len2; j++) {
          expect(kwtest.toRe().test(fixtures[j])).toEqual(expected[j]);
        }
      });
    };
  });

  describe('createRetrieKeywordFilter', () => {
    it('should work', () => {
      expect(createRetrieKeywordFilter(['ap', 'an'])('banana')).toEqual(true);
      expect(createRetrieKeywordFilter(['ap', 'an'], true)('banana')).toEqual(false);
    });
  });
});

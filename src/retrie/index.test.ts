import { describe, it } from 'mocha';
import { expect } from 'expect';
import { retrie } from '.';

describe('retrie', () => {
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
  ] as const)) {
    it(JSON.stringify(test[0]), () => {
      const kwtest = retrie(test[0]);
      const fixtures = test[1];
      const expected = test[2];

      for (let i = 0, len = fixtures.length; i < len; i++) {
        expect(kwtest.toRe().test(fixtures[i])).toEqual(expected[i]);
      }
    });
  };
});

import { describe, it } from 'mocha';
import { expect } from 'earl';
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
        expect(kwtest(fixtures[i])).toEqual(expected[i]);
      }
    }
  });

  it('should match a keyword reachable only through a failure link', () => {
    // '^Y' walks into the '^Ya^' branch, where the node is not itself a word
    // end -- but its failure link lands on the 'Y' keyword.
    expect(createAhoCorasick(['Y', '^Ya^'])('^Y')).toEqual(true);
    expect(createAhoCorasick(['ab', 'bc'])('xabc')).toEqual(true);
    expect(createAhoCorasick(['abcd', 'bc'])('zabcz')).toEqual(true);
    expect(createAhoCorasick(['his', 'she'])('ushers')).toEqual(true);
  });

  it('should agree with String#includes on random inputs', () => {
    const alphabet = 'abcXY!$^.';
    let seed = 1;
    const rnd = () => {
      // xorshift32, kept deterministic so failures reproduce
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 4_294_967_296;
    };
    const randStr = (maxLen: number) => {
      const n = 1 + Math.floor(rnd() * maxLen);
      let s = '';
      for (let i = 0; i < n; i++) s += alphabet[Math.floor(rnd() * alphabet.length)];
      return s;
    };

    for (let trial = 0; trial < 400; trial++) {
      const keys: string[] = [];
      for (let i = 0, n = 1 + Math.floor(rnd() * 10); i < n; i++) {
        keys.push(randStr(6));
      }
      const test = createAhoCorasick(keys.slice());

      for (let t = 0; t < 20; t++) {
        const text = randStr(24);
        expect(test(text)).toEqual(keys.some((key) => text.includes(key)));
      }
    }
  });
});

import { expect } from 'expect';
import { compareSource, createCompareSource, fileEqualWithCommentComparator } from '.';

// eslint-disable-next-line @typescript-eslint/require-await -- async iterable
async function *createSource<T>(input: T[]) {
  for (const line of input) {
    yield line;
  }
}

describe('compareSource', () => {
  describe('old fileEqual test', () => {
    const fileEqual = createCompareSource(fileEqualWithCommentComparator);

    async function test(a: string[], b: string[], expected: boolean) {
      expect((await fileEqual(a, createSource(b)))).toBe(expected);
    }

    it('same', () => test(
      ['A', 'B'],
      ['A', 'B'],
      true
    ));

    it('ignore comment 1', async () => {
      await test(
        ['# A', 'B'],
        ['# B', 'B'],
        true
      );
    });

    it('ignore comment 2', () => test(
      ['# A', '# C', 'B'],
      ['# A', '# D', 'B'],
      true
    ));

    it('ignore comment 3', () => test(
      ['# A', '# C', 'B'],
      ['# A', '# D', 'A'],
      false
    ));

    it('comment more', () => test(
      ['# A', 'B'],
      ['# A', '# B', 'B'],
      false
    ));

    it('comment less', () => test(
      ['# A', '# B', 'B'],
      ['# A', 'B'],
      false
    ));

    it('larger', () => test(
      ['A', 'B'],
      ['A', 'B', 'C'],
      false
    ));

    it('smaller', () => test(
      ['A', 'B', 'C'],
      ['A', 'B'],
      false
    ));

    it('smaller #2', () => test(
      ['A', 'B', '', ''],
      [],
      false
    ));

    it('eol more #1', () => test(
      ['A', 'B'],
      ['A', 'B', ''],
      false
    ));

    it('eol more #2', () => test(
      ['A', 'B', ''],
      ['A', 'B', '', ''],
      false
    ));

    it('eol less #1', () => test(
      ['A', 'B', ''],
      ['A', 'B'],
      false
    ));

    it('eol less #2', () => test(
      ['A', 'B', '', ''],
      ['A', 'B', ''],
      false
    ));

    it('sgmodule', () => test(
      ['#!name=[Sukka] URL Redirect', '#!desc=Last Updated: 2025-04-21T13:01:42.570Z Size: 127', '', 'always-real-ip'],
      ['#!name=[Sukka] URL Redirect', '#!desc=Last Updated: 2025-04-20T13:01:42.570Z Size: 130', '', 'always-real-ip'],
      true
    ));
  });

  describe('createCompareSource', async () => {
    expect(await createCompareSource()(['A', 'B'], ['A', 'B'])).toBe(true);
  });

  describe('compareSource', async () => {
    expect(await compareSource(['A', 'B'], ['A', 'B'])).toBe(true);
  });
});

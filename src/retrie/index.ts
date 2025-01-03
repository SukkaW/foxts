// TypeScript port of [retrie](https://github.com/satyr/retrie), which is a Coco -> JS port of [@dankogai](https://x.com/dankogai)'s [RegexpTrie](https://metacpan.org/release/DANKOGAI/Regexp-Trie-0.02/view/lib/Regexp/Trie.pm).

interface Trie {
  [key: string]: Trie | ''
}

const shouldEscapeChars = new Set<string>([
  '.',
  '?',
  '*',
  '+',
  '^',
  '$',
  '|',
  '(',
  ')',
  '{',
  '[',
  '\\'
]);

export function retrie(keywords: ArrayLike<string>, asPrefixes = false) {
  const tree: Trie = {};

  const add = (keywords: string, asPrefixes: boolean) => {
    let keyword: string;
    let ref = tree;

    for (let i = 0, len = keywords.length; i < len; ++i) {
      keyword = keywords.charAt(i);
      if (!(keyword in ref)) {
        ref[keyword] = asPrefixes
          ? { '': '' }
          : {};
      }

      ref = ref[keyword] as Trie;
    }

    if (asPrefixes) {
      ref[''] = '';
    }
  };

  for (let i = 0, len = keywords.length; i < len; ++i) {
    add(keywords[i], asPrefixes);
  }

  const toString = () => {
    function recur(it: Trie): string {
      let q = false;
      let re;
      let sub: string | undefined;
      let cconly = false;
      const alt: string[] = [];
      const cc: string[] = [];

      // eslint-disable-next-line guard-for-in -- plain object
      for (const chr in it) {
        if (!chr) {
          q = true;
          continue;
        }

        sub = recur(it[chr] as Trie);

        (sub ? alt : cc).push(
          (
            chr === '-'
              // eslint-disable-next-line sukka/unicorn/prefer-string-raw -- regexp escape
              ? '\\x2d'
              : (
                shouldEscapeChars.has(chr)
                  ? '\\' + chr
                  : chr
              )
          )
          + sub
        );
      }

      if (q && sub == null) {
        return '';
      }

      cconly = !alt.length;

      if (cc.length) {
        alt.push(
          cc[1]
            ? '[' + cc.join('') + ']'
            : cc[0]
        );
      }

      re = alt[1]
        ? '(?:' + alt.join('|') + ')'
        : alt[0];

      if (q) {
        re = cconly
          ? re + '?'
          : '(?:' + re + ')?';
      }

      return re || '';
    }
    return recur(tree);
  };

  const toRe = () => new RegExp(
    (asPrefixes ? '^' : '')
    + toString()
  );

  return {
    add,
    toString,
    toRe
  };
}

export function createRetrieKeywordFilter(keywords: ArrayLike<string>, asPrefixes = false) {
  const re = retrie(keywords, asPrefixes).toRe();
  return re.test.bind(re);
}

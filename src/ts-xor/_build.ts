/** ts-xor | Kostis Maninakis | MIT | https://github.com/maninak/ts-xor/blob/5642bd40b7e9ca68698e506dac53c36ff0329ab0/src/xorFactory.js  */

import typescript from 'typescript';
import { createFixedArray } from '../create-fixed-array';

import { tagged as ts } from '../tagged';

import fs from 'node:fs';
import path from 'node:path';

const xorParamCount = 8;
const countOfUniqueLetters = 20;
/**
 * Contains ['A', 'B', ..., <countOfUniqueLetters'th_letter_used_in_Array_constructor>]
 */
const uniqueLetters = createFixedArray(countOfUniqueLetters).map(i => String.fromCharCode(i + 65));
const allParamNames = getUniqueSymbolPermutationsGivenPool(uniqueLetters, xorParamCount);
const paramNamesExcludingANorB = allParamNames.slice(2);

function createXor() {
  const modifiers = [typescript.factory.createToken(typescript.SyntaxKind.ExportKeyword)];
  const name = typescript.factory.createIdentifier('XOR');
  const typeParams = createXorParams();
  const type = createXorType();

  return typescript.factory.createTypeAliasDeclaration(modifiers, name, typeParams, type);
}

function createXorParams() {
  return [
    typescript.factory.createTypeParameterDeclaration(undefined, typescript.factory.createIdentifier('A')),
    typescript.factory.createTypeParameterDeclaration(undefined, typescript.factory.createIdentifier('B')),
    ...paramNamesExcludingANorB.map((letter) => typescript.factory.createTypeParameterDeclaration(
      undefined,
      typescript.factory.createIdentifier(letter),
      undefined,
      typescript.factory.createTypeReferenceNode('unknown')
    ))
  ];
}

function createXorType() {
  const unionOfWithouts = typescript.factory.createUnionTypeNode([
    createWithoutLettersIntersectingLetter(
      allParamNames.filter((letterToExclude) => letterToExclude !== 'A'),
      'A'
    ),
    createWithoutLettersIntersectingLetter(
      allParamNames.filter((letterToExclude) => letterToExclude !== 'B'),
      'B'
    ),
    ...paramNamesExcludingANorB.map(
      (letter) => typescript.factory.createTypeReferenceNode(
        'EvalIfNotUnknown',
        [
          typescript.factory.createTypeReferenceNode(letter),
          createWithoutLettersIntersectingLetter(
            allParamNames.filter((letterToExclude) => letterToExclude !== letter),
            letter
          )
        ]
      )
    )
  ]);

  return typescript.factory.createTypeReferenceNode('Prettify', [unionOfWithouts]);
}

function createWithoutLettersIntersectingLetter(lettersExcludingLetter: string[], excludedLetter: string) {
  return typescript.factory.createIntersectionTypeNode([
    createWithout(lettersExcludingLetter, excludedLetter),
    typescript.factory.createTypeReferenceNode(excludedLetter)
  ]);
}

function createWithout(lettersExcludingLetter: string[], excludedLetter: string) {
  return typescript.factory.createTypeReferenceNode('Without', [
    typescript.factory.createIntersectionTypeNode(
      lettersExcludingLetter.map((letter) => typescript.factory.createTypeReferenceNode(letter))
    ),
    typescript.factory.createTypeReferenceNode(excludedLetter)
  ]);
}

/**
 * Takes a `symbolPool` and uses them solo and then matches them in pairs until
 * the provided count of unique symbols is reached.
 * If all possible pairs with the available symbols are already created and the
 * `countPermsToGenerate` is still not reached, then triplets will start to be generated,
 * then quadruplets, etc.
 *
 * @example
 * ```ts
 * getUniqueSymbolPermutationsGivenPool(['A', 'B'], 8)
 * // ['A', 'B', 'AA', 'AB', 'BA', 'BB', 'AAA', 'AAB']
 * ```
 */
function getUniqueSymbolPermutationsGivenPool(symbolPool: string[], countPermsToGenerate: number) {
  const generateItem = (index: number): string => {
    if (index < 0) {
      return '';
    }
    const remainder = index % 20;
    return generateItem(Math.floor(index / 20) - 1) + symbolPool[remainder];
  };

  return createFixedArray(countPermsToGenerate).map(generateItem);
}

const tempFile = typescript.createSourceFile(
  'temp.ts',
  '',
  typescript.ScriptTarget.ESNext,
  false, typescript.ScriptKind.TS
);
const printer = typescript.createPrinter({
  newLine: typescript.NewLineKind.LineFeed,
  omitTrailingSemicolon: true
});

const xorTsFileContents = ts`import type { EvalIfNotUnknown, Prettify, Without } from './_utils';

${printer.printNode(
  typescript.EmitHint.Unspecified,
  typescript.factory.createJSDocComment(
    `Restrict using either exclusively the keys of \`T\` or \
exclusively the keys of \`U\`.\n\n\
No unique keys of \`T\` can be used simultaneously with \
any unique keys of \`U\`.\n\n@example\n\
\`\`\`ts\nconst myVar: XOR<{ data: object }, { error: object }>\n\`\`\`\n\n\
Supports from 2 up to ${xorParamCount} generic parameters.\n\n\
More: https://github.com/maninak/ts-xor/tree/master#description\n`
  ),
  tempFile
)}

${printer.printNode(typescript.EmitHint.Unspecified, createXor(), tempFile)};
\n\n`;

const targetFile = path.resolve(__dirname, 'index.ts');
fs.writeFileSync(targetFile, xorTsFileContents, { encoding: 'utf-8' });

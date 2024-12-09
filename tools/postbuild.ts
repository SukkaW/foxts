import fsp from 'node:fs/promises';
import path from 'node:path';
import { getEntries } from './get-entries';

import type { PackageJson } from '@package-json/types';

const rootDir = process.cwd();
const distDir = path.resolve(rootDir, 'dist');

interface GzipStats {
  total: { raw: number, gzip: number, br: number },
  exports: Record<string, { raw: number, gzip: number, br: number }>
}

function copyAndCreateFiles() {
  return Promise.all([
    fsp.copyFile(
      path.resolve(rootDir, 'LICENSE'),
      path.resolve(distDir, 'LICENSE')
    ),
    fsp.copyFile(
      path.resolve(rootDir, 'README.md'),
      path.resolve(distDir, 'README.md')
    ),
    fsp.writeFile(path.resolve(distDir, 'ts_version_4.8_and_above_is_required.d.ts'), '')
  ]);
}

async function createPackageJson(entries: Record<string, string>) {
  const packageJsonCopy = JSON.parse(
    await fsp.readFile(path.resolve(rootDir, 'package.json'), 'utf-8')
  ) as PackageJson;

  delete packageJsonCopy.devDependencies;
  delete packageJsonCopy.private;
  delete packageJsonCopy.scripts;

  packageJsonCopy.typeVersions = {
    '>=4.8': {
      '*': ['*']
    },
    '*': {
      '*': ['ts_version_4.8_and_above_is_required.d.ts']
    }
  };

  packageJsonCopy.exports = {
    './package.json': './package.json',
    './sizes.json': './sizes.json'
  };

  Object.keys(entries).forEach(entryName => {
    // This is an unnecessary check to make TypeScript happy
    // For some reason TypeScript ignores the assignment above
    packageJsonCopy.exports ??= {};

    packageJsonCopy.exports[`./${entryName}`] = {
      types: `./${entryName}/index.d.ts`,
      import: {
        types: `./${entryName}/index.d.ts`,
        default: `./${entryName}/index.mjs`
      },
      require: `./${entryName}/index.cjs`,
      default: `./${entryName}/index.js`
    };
  });

  await fsp.writeFile(
    path.resolve(distDir, 'package.json'),
    JSON.stringify(packageJsonCopy, null, 2)
  );
}

(async () => {
  const entriesPromise = getEntries();

  await Promise.all([
    copyAndCreateFiles(),
    createPackageJson(await entriesPromise),
  ]);
})();

import fs from 'node:fs';
import path from 'node:path';

import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import { oxcResolve } from 'rollup-plugin-oxc-resolve';

import { defineConfig } from 'rollup';
import isCI from 'is-ci';

import pkgJson from './package.json';

import type { PackageJson } from '@package-json/types';

const externalModules = ('dependencies' in pkgJson && pkgJson.dependencies && typeof pkgJson.dependencies === 'object')
  ? Object.keys(pkgJson.dependencies)
  : [];

export default defineConfig(() => {
  const sources = fs.readdirSync(path.resolve('./src'));

  const external = (mod: string) => {
    if (mod.startsWith('node:')) return true;
    if (externalModules.includes(mod)) return true;
    return externalModules.some((m) => mod.startsWith(`${m}/`));
  };

  fs.writeFileSync(
    path.resolve('./package.json'),
    JSON.stringify(
      Object.assign(
        pkgJson,
        {
          exports: sources.reduce<PackageJson['exports'] & {}>(
            (acc, source) => {
              acc[`./${source}`] = {
                types: `./dist/${source}/index.d.ts`,
                import: `./dist/${source}/index.mjs`,
                require: `./dist/${source}/index.js`,
                default: `./dist/${source}/index.js`
              };

              return acc;
            },
            { './package.json': './package.json' }
          )
        }
      ),
      null, 2
    ) + '\n',
    { encoding: 'utf-8' }
  );

  const input = sources.reduce<Record<string, string>>((acc, source) => {
    acc[source] = `src/${source}/index.ts`;
    return acc;
  }, {});

  const distDir = path.resolve('./dist');
  if (isCI && fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.mkdirSync(distDir);
  }

  return [
    defineConfig({
      input,
      output: [
        { dir: 'dist', entryFileNames: '[name]/index.js', format: 'cjs', sourcemap: false, compact: true },
        { dir: 'dist', entryFileNames: '[name]/index.mjs', format: 'esm', sourcemap: false, compact: true }
      ],
      plugins: [
        oxcResolve(),
        swc({
          isModule: true,
          minify: true,
          jsc: {
            minify: {
              compress: {
                passes: 3,
                const_to_let: false
              },
              mangle: {},
              module: true,
              keep_fnames: false
            }
          }
        })
      ],
      external
    }),
    defineConfig({
      input,
      output: { dir: 'dist', entryFileNames: '[name]/index.d.ts' },
      plugins: [
        dts({ respectExternal: true })
      ],
      external
    })
  ];
});

import { defineConfig } from 'rollup';
import { swc, preserveUseDirective } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import fsp from 'node:fs/promises';

import $pkgJson from './package.json';
import { getEntries } from './tools/get-entries';

import type { PackageJson } from '@package-json/types';

const pkgJson: PackageJson = $pkgJson as any;

const externalModules = Object.keys(pkgJson.dependencies || {})
  .concat(Object.keys(pkgJson.peerDependencies || {}))
  .concat([
    'react-router-dom',
    'next'
  ]);
function external(id: string) {
  return id.startsWith('node:') || externalModules.some((name) => id === name || id.startsWith(`${name}/`));
}

export default async function () {
  await fsp.rm('dist', { recursive: true, force: true });

  const input = await getEntries();

  return defineConfig([{
    input,
    output: [
      {
        dir: 'dist',
        format: 'commonjs',
        entryFileNames: '[name]/index.cjs',
        chunkFileNames: 'chunks/[name].[hash].cjs',
        compact: true
      },
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name]/index.mjs',
        chunkFileNames: 'chunks/[name].[hash].mjs',
        compact: true
      }],
    plugins: [
      nodeResolve({
        exportConditions: ['import', 'module', 'require', 'default']
      }),
      swc({
        isModule: true,
        jsc: {
          target: 'es2022',
          transform: {
            react: {
              runtime: 'automatic'
            }
          },
          minify: {
            compress: {
              passes: 2,
              const_to_let: false
            },
            mangle: {},
            module: true
          }
        },
        minify: true
      }),
      preserveUseDirective()
    ],
    external,
    cache: true
  }, {
    input,
    output: {
      dir: 'dist',
      format: 'commonjs',
      entryFileNames: '[name]/index.d.ts'
    },
    external,
    plugins: [dts({ respectExternal: true })]
  }]);
}

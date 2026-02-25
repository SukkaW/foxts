import { describe, it } from 'mocha';
import { expect } from 'earl';
import { availableParallelism } from '.';
import * as os from 'node:os';

describe('available-parallelism', () => {
  it('node.js usage 1', () => {
    expect(availableParallelism(os)).toBeGreaterThan(0);
  });
  it('node.js usage 2', async () => {
    expect(await availableParallelism(import('node:os'))).toBeGreaterThan(0);
  });
  it('legacy node.js w/o availableParallelism()', async () => {
    expect(availableParallelism({ cpus: () => [] })).toEqual(1);
    expect(await availableParallelism(Promise.resolve({
      cpus: () => []
    }))).toBeGreaterThan(0);
  });
  it('browser usage', () => {
    expect(availableParallelism({
      hardwareConcurrency: 4
    })).toEqual(4);
  });
  it('auto detect platform', async () => {
    expect(await availableParallelism()).toBeGreaterThan(0);
  });
  it('bad args', () => {
    expect(availableParallelism({})).toEqual(1);
  });
});

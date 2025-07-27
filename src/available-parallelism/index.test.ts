import { describe, it } from 'mocha';
import { expect } from 'expect';
import { availableParallelism } from '.';
import * as os from 'node:os';

describe('available-parallelism', () => {
  it('node.js usage 1', () => {
    expect(availableParallelism(os)).toBeGreaterThan(0);
  });
  it('node.js usage 2', async () => {
    await expect(availableParallelism(import('node:os'))).resolves.toBeGreaterThan(0);
  });
  it('legacy node.js w/o availableParallelism()', async () => {
    expect(availableParallelism({ cpus: () => [] })).toBe(1);
    await expect(availableParallelism(Promise.resolve({
      cpus: () => []
    }))).resolves.toBeGreaterThan(0);
  });
  it('browser usage', () => {
    expect(availableParallelism({
      hardwareConcurrency: 4
    })).toBe(4);
  });
  it('auto detect platform', async () => {
    await expect(availableParallelism()).resolves.toBeGreaterThan(0);
  });
  it('bad args', () => {
    expect(availableParallelism({})).toBe(1);
  });
});

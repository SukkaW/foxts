import { describe, it } from 'mocha';
import { expect } from 'expect';
import { wait, waitWithAbort } from '.';
import sinon from 'sinon';

describe('wait', () => {
  let clock: sinon.SinonFakeTimers;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  it('sleep', () => {
    const start = Date.now();

    wait(100); // no promise here since sinon hang the clocks
    clock.runAll();

    const end = Date.now();
    expect(end - start).toEqual(100);
  });

  it('sleepWithAbort #1', async () => {
    const abortController = new AbortController();
    const p = expect(waitWithAbort(1000, abortController.signal)).rejects.toThrow('aborted');
    abortController.abort();
    clock.runAll();
    await p;
  });

  it('sleepWithAbort #2', async () => {
    const abortController = new AbortController();
    abortController.abort();

    const p = expect(waitWithAbort(1000, abortController.signal)).rejects.toThrow('aborted');
    clock.runAll();
    await p;
  });

  it('sleepWithAbort #3', () => {
    const start = Date.now();

    waitWithAbort(1000, (new AbortController()).signal);
    clock.runAll();

    const end = Date.now();
    expect(end - start).toEqual(1000);
  });

  afterEach(() => {
    clock.restore();
  });
});

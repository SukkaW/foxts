import { describe, it } from 'mocha';
import { expect } from 'expect';
import { wait } from '.';
import sinon from 'sinon';

describe('wait', () => {
  let clock: sinon.SinonFakeTimers;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  it('should work', () => {
    const start = Date.now();

    wait(100); // no promise here since sinon hang the clocks
    clock.runAll();

    const end = Date.now();
    expect(end - start).toEqual(100);
  });

  afterEach(() => {
    clock.restore();
  });
});

import { describe, it } from 'mocha';
import { expect } from 'expect';
import { wait } from '.';

describe('wait', () => {
  it('should work', async () => {
    const start = Date.now();
    await wait(30);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(30);
    expect(end - start).toBeLessThan(50);
  });
});

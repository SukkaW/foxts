import { describe, it } from 'mocha';
import { expect } from 'earl';
import { fastIpVersion } from '.';

describe('fast-ip-version', () => {
  it('fastIpVersion', () => {
    expect(fastIpVersion('1.1.1.1')).toEqual(4);
    expect(fastIpVersion('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toEqual(6);
    expect(fastIpVersion('invalid')).toEqual(0);
    expect(fastIpVersion('[]')).toEqual(0);
  });
});

import { describe, it } from 'mocha';
import { expect } from 'expect';
import { isProbablyIpv4, isProbablyIpv6 } from '.';

describe('is-probably-ip', () => {
  it('isProbablyIpv4', () => {
    expect(isProbablyIpv4('abc')).toBe(false);
    expect(isProbablyIpv4('ajldsaldklsajdklsajlkdasjlkadsjl')).toBe(false);
    expect(isProbablyIpv4('1.1.1.1')).toBe(true);
    expect(isProbablyIpv4('1.a.1.1')).toBe(false);
  });

  it('isProbablyIpv6', () => {
    expect(isProbablyIpv6('ab')).toBe(false);
    expect(isProbablyIpv6('[]')).toBe(false);
    expect(isProbablyIpv6('ajldsaldklsajdklsajlkdasjlkadsjlajldsaldklsajdklsajlkdasjlkadsjl')).toBe(false);
    expect(isProbablyIpv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
    expect(isProbablyIpv6('g001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(false);
    expect(isProbablyIpv6('[2001:0db8:85a3:0000:0000:8a2e:0370:7334]')).toBe(true);
  });
});

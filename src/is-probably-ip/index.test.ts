import { describe, it } from 'mocha';
import { expect } from 'earl';
import { isProbablyIpv4, isProbablyIpv6 } from '.';

describe('is-probably-ip', () => {
  it('isProbablyIpv4', () => {
    expect(isProbablyIpv4('abc')).toEqual(false);
    expect(isProbablyIpv4('ajldsaldklsajdklsajlkdasjlkadsjl')).toEqual(false);
    expect(isProbablyIpv4('1.1.1.1')).toEqual(true);
    expect(isProbablyIpv4('1.a.1.1')).toEqual(false);
  });

  it('isProbablyIpv6', () => {
    expect(isProbablyIpv6('ab')).toEqual(false);
    expect(isProbablyIpv6('[]')).toEqual(false);
    expect(isProbablyIpv6('ajldsaldklsajdklsajlkdasjlkadsjlajldsaldklsajdklsajlkdasjlkadsjl')).toEqual(false);
    expect(isProbablyIpv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toEqual(true);
    expect(isProbablyIpv6('g001:0db8:85a3:0000:0000:8a2e:0370:7334')).toEqual(false);
    expect(isProbablyIpv6('[2001:0db8:85a3:0000:0000:8a2e:0370:7334]')).toEqual(true);
  });
});

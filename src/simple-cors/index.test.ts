import { describe, it } from 'mocha';
import { expect } from 'expect';
import { createSimpleCors } from '.';

describe('merge-headers', () => {
  const cors1 = createSimpleCors();
  const cors2 = createSimpleCors({
    origin: 'http://example.com',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true
  });
  const cors3 = createSimpleCors({
    origin: ['http://example.com', 'http://example.org', 'http://example.dev']
  });
  const cors4 = createSimpleCors({
    origin: (origin) => (origin.endsWith('.example.com') ? origin : 'http://example.com')
  });

  const cors5 = createSimpleCors();
  const cors6 = createSimpleCors({
    origin: 'http://example.com'
  });

  const cors7 = createSimpleCors({
    origin: (origin) => (origin === 'http://example.com' ? origin : '*'),
    allowMethods: (origin) => (origin === 'http://example.com'
      ? ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE']
      : ['GET', 'HEAD'])
  });

  const cors8 = createSimpleCors({
    origin: (origin) => new Promise<string>((resolve) => { resolve(origin.endsWith('.example.com') ? origin : 'http://example.com'); })
  });

  const cors9 = createSimpleCors({
    origin: (origin) => new Promise<string>((resolve) => { resolve(origin === 'http://example.com' ? origin : '*'); }),
    allowMethods: (origin) => new Promise<string[]>((resolve) => {
      resolve(
        origin === 'http://example.com'
          ? ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE']
          : ['GET', 'HEAD']
      );
    })
  });

  it('GET default', async () => {
    const res = await cors1(new Request('http://localhost/api/abc'), Response.json({}));

    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Vary')).toBeNull();
  });

  it('Preflight default', async () => {
    const req = new Request('https://localhost/api/abc', { method: 'OPTIONS' });
    req.headers.append('Access-Control-Request-Headers', 'X-PINGOTHER, Content-Type');
    const res = await cors1(new Request(req), new Response(null, { status: 204 }));

    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Methods')?.split(',')[0]).toBe('GET');
    expect(res.headers.get('Access-Control-Allow-Headers')?.split(',')).toEqual([
      'X-PINGOTHER',
      'Content-Type'
    ]);
  });

  it('Preflight with options', async () => {
    const req = new Request('https://localhost/api2/abc', {
      method: 'OPTIONS',
      headers: { origin: 'http://example.com' }
    });

    const res = await cors2(new Request(req), new Response(null, { status: 204 }));

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com');
    expect(res.headers.get('Vary')?.split(/\s*,\s*/)).toEqual(expect.arrayContaining(['Origin']));
    expect(res.headers.get('Access-Control-Allow-Headers')?.split(/\s*,\s*/)).toEqual([
      'X-Custom-Header',
      'Upgrade-Insecure-Requests'
    ]);
    expect(res.headers.get('Access-Control-Allow-Methods')?.split(/\s*,\s*/)).toEqual([
      'POST',
      'GET',
      'OPTIONS'
    ]);
    expect(res.headers.get('Access-Control-Expose-Headers')?.split(/\s*,\s*/)).toEqual([
      'Content-Length',
      'X-Kuma-Revision'
    ]);
    expect(res.headers.get('Access-Control-Max-Age')).toBe('600');
    expect(res.headers.get('Access-Control-Allow-Credentials')).toBe('true');
  });

  it('Disallow an unmatched origin', async () => {
    const req = new Request('https://localhost/api2/abc', {
      method: 'OPTIONS',
      headers: { origin: 'http://example.net' }
    });
    const res = await cors2(new Request(req), new Response(null, { status: 204 }));
    expect(res.headers.has('Access-Control-Allow-Origin')).toBeFalsy();
  });

  it('Allow multiple origins', async () => {
    let req = new Request('http://localhost/api3/abc', {
      headers: {
        Origin: 'http://example.org'
      }
    });
    let res = await cors3(new Request(req), Response.json({}));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://example.org');

    req = new Request('http://localhost/api3/abc');
    res = await cors3(new Request(req), Response.json({}));
    expect(
      res.headers.has('Access-Control-Allow-Origin')
      // 'An unmatched origin should be disallowed'
    ).toBeFalsy();

    req = new Request('http://localhost/api3/abc', {
      headers: {
        Referer: 'http://example.net/'
      }
    });
    res = await cors3(new Request(req), Response.json({}));
    expect(
      res.headers.has('Access-Control-Allow-Origin')
      // 'An unmatched origin should be disallowed'
    ).toBeFalsy();
  });

  it('Allow different Vary header value', async () => {
    const res = await cors3(new Request('http://localhost/api3/abc', {
      headers: {
        Vary: 'accept-encoding',
        Origin: 'http://example.com'
      }
    }), Response.json({}));

    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com');
    expect(res.headers.get('Vary')).toBe('accept-encoding');
  });

  it('Allow origins by function', async () => {
    let req = new Request('http://localhost/api4/abc', {
      headers: {
        Origin: 'http://subdomain.example.com'
      }
    });
    let res = await cors4(new Request(req), Response.json({}));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://subdomain.example.com');

    req = new Request('http://localhost/api4/abc');
    res = await cors4(new Request(req), Response.json({}));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com');

    req = new Request('http://localhost/api4/abc', {
      headers: {
        Referer: 'http://evil-example.com/'
      }
    });
    res = await cors4(new Request(req), Response.json({}));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com');
  });

  it('Allow origins by promise returning function', async () => {
    let req = new Request('http://localhost/api8/abc', {
      headers: {
        Origin: 'http://subdomain.example.com'
      }
    });
    let res = await cors8(new Request(req), Response.json({}));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://subdomain.example.com');

    req = new Request('http://localhost/api8/abc');
    res = await cors8(new Request(req), Response.json({}));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com');

    req = new Request('http://localhost/api8/abc', {
      headers: {
        Referer: 'http://evil-example.com/'
      }
    });
    res = await cors8(new Request(req), Response.json({}));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com');
  });

  it('With raw Response object', async () => {
    const res = await cors5(new Request('http://localhost/api5/abc'), Response.json({}));

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Vary')).toBeNull();
  });

  it('Should not return duplicate header values', async () => {
    const res = await cors6(new Request('http://localhost/api6/abc', {
      headers: {
        origin: 'http://example.com'
      }
    }), Response.json({}));

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com');
  });

  it('Allow methods by function', async () => {
    const req = new Request('http://localhost/api7/abc', {
      headers: {
        Origin: 'http://example.com'
      },
      method: 'OPTIONS'
    });
    const res = await cors7(new Request(req), Response.json({}));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com');
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('GET,HEAD,POST,PATCH,DELETE');

    const req2 = new Request('http://localhost/api7/abc', {
      headers: {
        Origin: 'http://example.org'
      },
      method: 'OPTIONS'
    });
    const res2 = await cors7(new Request(req2), Response.json({}));
    expect(res2.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res2.headers.get('Access-Control-Allow-Methods')).toBe('GET,HEAD');
  });

  it('Allow methods by promise returning function', async () => {
    const req = new Request('http://localhost/api9/abc', {
      headers: {
        Origin: 'http://example.com'
      },
      method: 'OPTIONS'
    });
    const res = await cors9(new Request(req), Response.json({}));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com');
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('GET,HEAD,POST,PATCH,DELETE');

    const req2 = new Request('http://localhost/api9/abc', {
      headers: {
        Origin: 'http://example.org'
      },
      method: 'OPTIONS'
    });
    const res2 = await cors9(new Request(req2), Response.json({}));
    expect(res2.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res2.headers.get('Access-Control-Allow-Methods')).toBe('GET,HEAD');
  });
});

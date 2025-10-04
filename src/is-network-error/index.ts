import sinderSorhusIsNetworkError from 'is-network-error';

const nodeErrorCodes = new Set([
  'ETIMEDOUT',
  'ECONNRESET',
  'ECONNREFUSED',
  'ENOTFOUND',
  'ENETDOWN',
  'ENETUNREACH',
  'EHOSTDOWN',
  'EHOSTUNREACH',
  'EPIPE',
  'UND_ERR_SOCKET',
  'UND_ERR_HEADERS_TIMEOUT'
]);

export function isNetworkError(error: unknown): boolean {
  if (typeof error !== 'object' || error == null) {
    return false;
  }

  // Add extra handles for NodeJS.ErrnoException
  if ('code' in error && typeof error.code === 'string') {
    if (error.code === 'ERR_UNESCAPED_CHARACTERS') {
      return false;
    }

    if (nodeErrorCodes.has(error.code)) {
      return true;
    }
  }

  // fallback:
  // - Chrome
  // - Firefox
  // - Safari 16, Safari 17
  // - Deno
  // - Bun (WebKit)
  // - Undici (Node.js)
  // - cross-fetch
  // - Cloudflare Workers (fetch)
  return sinderSorhusIsNetworkError(error);
}

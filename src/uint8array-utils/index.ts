import { never } from '../guard';

const U8 = Uint8Array;
const AB = ArrayBuffer;

const TD = TextDecoder;

const singletonEncoder = new TextEncoder();

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Use a lookup table to find the index.
const lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}

export function stringToUint8Array(str: string): Uint8Array {
  return singletonEncoder.encode(str);
}

const singletonDecoders: Record<string, TextDecoder> = {
  utf8: new TD('utf8')
};

export function uint8ArrayToString(array: ArrayBuffer | ArrayBufferView, encoding = 'utf8') {
  singletonDecoders[encoding] ??= new TD(encoding);
  return singletonDecoders[encoding].decode(array);
}

function base64UrlToBase64(base64url: string): string {
  const base64 = base64url.replaceAll('-', '+').replaceAll('_', '/');
  const padding = (4 - (base64.length % 4)) % 4;
  return base64 + '='.repeat(padding);
}

function base64ToBase64Url(base64: string): string {
  return base64.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export function base64ToUint8Array(base64String: string): Uint8Array {
  const base64 = base64UrlToBase64(base64String);
  const len = base64.length;

  let bufferLength = base64.length * 0.75,
    i,
    p = 0,
    encoded1,
    encoded2,
    encoded3,
    encoded4;

  if (base64[base64.length - 1] === '=') {
    bufferLength--;
    if (base64[base64.length - 2] === '=') {
      bufferLength--;
    }
  }

  const bytes = new Uint8Array(new ArrayBuffer(bufferLength));

  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)];
    encoded2 = lookup[base64.charCodeAt(i + 1)];
    encoded3 = lookup[base64.charCodeAt(i + 2)];
    encoded4 = lookup[base64.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return bytes;
}

// TODO: implement a modern version using Uint8Array.fromBase64 + base64UrlToBase64

export function uint8ArrayToBase64(array: Uint8Array, urlSafe = false) {
  let base64 = '';
  const len = array.length;

  for (let i = 0; i < len; i += 3) {
    base64 += chars[array[i] >> 2];
    base64 += chars[((array[i] & 3) << 4) | (array[i + 1] >> 4)];
    base64 += chars[((array[i + 1] & 15) << 2) | (array[i + 2] >> 6)];
    base64 += chars[array[i + 2] & 63];
  }

  if (len % 3 === 2) {
    base64 = base64.slice(0, Math.max(0, base64.length - 1)) + '=';
  } else if (len % 3 === 1) {
    base64 = base64.slice(0, Math.max(0, base64.length - 2)) + '==';
  }

  return urlSafe ? base64ToBase64Url(base64) : base64;
}

export function concatUint8Arrays(arrays: Uint8Array[], totalLength?: number): Uint8Array {
  if (arrays.length === 0) return new U8(0);

  totalLength ??= arrays.reduce((acc, cur) => acc + cur.length, 0);
  const result = new U8(totalLength);

  let offset = 0;
  for (let i = 0, len = arrays.length; i < len; i++) {
    const array = arrays[i];
    result.set(array, offset);
    offset += array.length;
  }

  return result;
}

export function toUint8Array(value: ArrayBuffer | ArrayBufferView) {
  if (value instanceof AB) {
    return new U8(value);
  }

  if (AB.isView(value)) {
    return new U8(value.buffer, value.byteOffset, value.byteLength);
  }

  never(value, 'value must be ArrayBuffer or ArrayBufferView');
}

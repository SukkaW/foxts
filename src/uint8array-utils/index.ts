import { never } from '../guard';

const U8 = Uint8Array;
const AB = ArrayBuffer;

const TD = TextDecoder;

const singletonEncoder = new TextEncoder();

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

// Reference: https://phuoc.ng/collection/this-vs-that/concat-vs-push/
// Important: Keep this value divisible by 3 so intermediate chunks produce no Base64 padding.
const MAX_BLOCK_SIZE = 65535;

function base64UrlToBase64(base64url: string): string {
  const base64 = base64url.replaceAll('-', '+').replaceAll('_', '/');
  const padding = (4 - (base64.length % 4)) % 4;
  return base64 + '='.repeat(padding);
}

function base64ToBase64Url(base64: string): string {
  return base64.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export function base64ToUint8Array(base64String: string): Uint8Array {
  return U8.from(atob(base64UrlToBase64(base64String)), x => x.charCodeAt(0));
}

// TODO: implement a modern version using Uint8Array.fromBase64 + base64UrlToBase64

export function uint8ArrayToBase64(array: Uint8Array, urlSafe = false) {
  let base64 = '';

  for (let index = 0; index < array.length; index += MAX_BLOCK_SIZE) {
    const chunk = array.subarray(index, index + MAX_BLOCK_SIZE);
    // Required as `btoa` and `atob` don't properly support Unicode: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
    // @ts-expect-error -- Uint8Array is fine here, as "apply" only requires ArrayLike<number>
    // https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.apply
    base64 += btoa(String.fromCharCode.apply(undefined, chunk as ArrayLike<number>));
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

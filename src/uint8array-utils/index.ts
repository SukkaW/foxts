const singletonEncoder = new TextEncoder();

export function stringToUint8Array(str: string): Uint8Array {
  return singletonEncoder.encode(str);
}

const singletonDecoders: Record<string, TextDecoder> = {
  utf8: new TextDecoder('utf8')
};

export function uint8ArrayToString(array: Uint8Array, encoding = 'utf8') {
  singletonDecoders[encoding] ??= new TextDecoder(encoding);
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
  return Uint8Array.from(atob(base64UrlToBase64(base64String)), x => x.charCodeAt(0));
}

// TODO: implement a modern version using Uint8Array.fromBase64 + base64UrlToBase64

export function uint8ArrayToBase64(array: Uint8Array, urlSafe = false) {
  let base64 = '';

  for (let index = 0; index < array.length; index += MAX_BLOCK_SIZE) {
    const chunk = array.subarray(index, index + MAX_BLOCK_SIZE);
    // Required as `btoa` and `atob` don't properly support Unicode: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
    // @ts-expect-error -- Uint8Array is fine here, as "apply" only requires ArrayLike<number>
    // https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.apply
    base64 += globalThis.btoa(String.fromCharCode.apply(undefined, chunk as ArrayLike<number>));
  }

  return urlSafe ? base64ToBase64Url(base64) : base64;
}

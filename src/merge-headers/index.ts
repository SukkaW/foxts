export type HeadersInitLike = string[][] | Record<string, string | readonly string[]> | Headers;

export function mergeHeaders(dest: HeadersInitLike, source: HeadersInitLike): Headers {
  const destHeaders = new Headers(dest);
  const sourceHeaders = new Headers(source);

  sourceHeaders.forEach((value, key) => {
    destHeaders.set(key, value);
  });

  return destHeaders;
}

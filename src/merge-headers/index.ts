export type HeadersInitLike = string[][] | Record<string, string | readonly string[]> | Headers;
export type IncomingHttpHeadersLike = Record<string, string | string[] | undefined>;
export type OutgoingHttpHeadersLike = Record<string, number | string | string[] | undefined>;

export function mergeHeaders(dest: HeadersInitLike, source: HeadersInitLike): Headers {
  const destHeaders = new Headers(dest);
  const sourceHeaders = new Headers(source);

  sourceHeaders.forEach((value: string, key: string) => {
    destHeaders.set(key, value);
  });

  return destHeaders;
}

export function mergeNodeHttpHeaders(dest: IncomingHttpHeadersLike, source: IncomingHttpHeadersLike): IncomingHttpHeadersLike;
export function mergeNodeHttpHeaders(dest: OutgoingHttpHeadersLike, source: IncomingHttpHeadersLike | OutgoingHttpHeadersLike): OutgoingHttpHeadersLike;
export function mergeNodeHttpHeaders(dest: IncomingHttpHeadersLike | OutgoingHttpHeadersLike, source: IncomingHttpHeadersLike | OutgoingHttpHeadersLike): IncomingHttpHeadersLike | OutgoingHttpHeadersLike {
  return Object.assign({}, dest, source);
}

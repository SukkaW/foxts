export type HeadersInitLike = string[][] | Record<string, string | readonly string[]> | Headers | null | undefined;
export type IncomingHttpHeadersLike = Record<string, string | string[] | undefined> | undefined | null;
export type OutgoingHttpHeadersLike = Record<string, number | string | string[] | undefined> | undefined | null;

export function mergeHeaders(
  dest: HeadersInitLike, source: HeadersInitLike,
  /**
   * Filter function to determine which headers from source to merge.
   *
   * Can be an array/iterable of header names to include, or a filter callback that takes a header name.
   */
  sourceFilter: Iterable<string> | null | undefined | ((headerName: string) => boolean) = null
): Headers {
  if (dest == null) {
    return source == null ? new Headers() : new Headers(source);
  }
  if (source == null) {
    return new Headers(dest);
  }

  const destHeaders = new Headers(dest);
  const sourceHeaders = new Headers(source);

  if (sourceFilter == null) {
    // fast path
    sourceHeaders.forEach((value: string, key: string) => {
      destHeaders.set(key, value);
    });

    return destHeaders;
  }

  if (typeof sourceFilter !== 'function') {
    const keys = new Set<string>(sourceFilter);
    sourceFilter = (headerName: string) => keys.has(headerName);
  }

  sourceHeaders.forEach((value: string, key: string) => {
    if (sourceFilter(key)) {
      destHeaders.set(key, value);
    }
  });

  return destHeaders;
}

export function mergeNodeHttpHeaders(dest: IncomingHttpHeadersLike, source: IncomingHttpHeadersLike): IncomingHttpHeadersLike;
export function mergeNodeHttpHeaders(dest: OutgoingHttpHeadersLike, source: IncomingHttpHeadersLike | OutgoingHttpHeadersLike): OutgoingHttpHeadersLike;
export function mergeNodeHttpHeaders(dest: IncomingHttpHeadersLike | OutgoingHttpHeadersLike, source: IncomingHttpHeadersLike | OutgoingHttpHeadersLike): IncomingHttpHeadersLike | OutgoingHttpHeadersLike {
  if (dest == null) {
    return source == null ? {} : source;
  }
  if (source == null) {
    return dest;
  }
  return Object.assign({}, dest, source);
}

import type { HeadersInitLike } from '../merge-headers';

export function headersToObject(headers: HeadersInitLike | Headers): Record<string, string> {
  if (headers instanceof Headers) {
    return Object.fromEntries(headers);
  }

  if (headers == null) {
    return {};
  }

  return Object.fromEntries(new Headers(headers));
}

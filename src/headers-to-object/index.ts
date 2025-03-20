import type { HeadersInitLike } from '../merge-headers';

export function headersToObject(headers: HeadersInitLike | Headers): Record<string, string> {
  const obj: Record<string, string> = {};

  if (headers == null) {
    return obj;
  }

  new Headers(headers).forEach((value: string, key: string) => {
    obj[key] = value;
  });

  return obj;
}

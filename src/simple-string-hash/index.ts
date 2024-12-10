import { fnv1a52 } from '../fnv1a52';

export function simpleStringHash(payload: string): string {
  return fnv1a52(payload).toString(36) + payload.length.toString(36);
}

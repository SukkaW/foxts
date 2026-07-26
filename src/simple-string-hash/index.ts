import { fnv1a52base36 } from 'fnv1a52';

export function simpleStringHash(payload: string): string {
  return fnv1a52base36(payload) + payload.length.toString(36);
}

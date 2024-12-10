import type { Writable } from 'node:stream';
import { once } from 'node:events';

/**
 * A small utility function for writing chunk to a stream, and only return promise when needed (stream backpressure)
 *
 * ```ts
 * const writeStream = fs.createWriteStream(outputFile);
 * for (const line of source) {
 *   const p = asyncWriteToStream(writeStream, line + '\n');
 *   if (p) {
 *     // eslint-disable-next-line no-await-in-loop -- stream backpressure
 *     await p;
 *   }
 * }
 */
export function asyncWriteToStream<T>(stream: Writable, chunk: T): Promise<unknown> | null {
  const waitDrain = !stream.write(chunk);
  if (waitDrain) {
    return once(stream, 'drain'); // returns a promise only if needed
  }
  return null;
}

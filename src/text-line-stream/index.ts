// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
// Modified by Sukka (https://skk.moe) to increase compatibility and performance with Bun & Node.js.

import { falseFn } from '../noop';

interface TextLineStreamOptions {
  /** Allow splitting by solo \r */
  allowCR?: boolean,

  skipEmptyLines?: boolean
}

/** Transform a stream into a stream where each chunk is divided by a newline,
 * be it `\n` or `\r\n`. `\r` can be enabled via the `allowCR` option.
 *
 * ```ts
 * const res = await fetch('https://example.com');
 * const lines = res.body!
 *   .pipeThrough(new TextDecoderStream())
 *   .pipeThrough(new TextLineStream());
 * ```
 */
export class TextLineStream extends TransformStream<string, string> {
  // private __buf = '';
  constructor({
    allowCR = false,
    skipEmptyLines = false
  }: TextLineStreamOptions = {}) {
    let __buf = '';
    let chunkIndex = 0;

    const transformOnCR = allowCR
      ? (chunk: string, lfIndex: number, controller: TransformStreamDefaultController<string>) => {
        const crIndex = chunk.indexOf('\r', chunkIndex);

        if (
          crIndex !== -1 && crIndex !== (chunk.length - 1)
          && (lfIndex === -1 || (lfIndex - 1) > crIndex)
        ) {
          const curChunk = chunk.slice(chunkIndex, crIndex);

          if (skipEmptyLines && curChunk.length === 0) {
            chunkIndex = crIndex + 1;
            return true;
          }

          controller.enqueue(chunk.slice(chunkIndex, crIndex));
          chunkIndex = crIndex + 1;

          // continue;
          return true;
        }

        return false;
      }
      : falseFn;

    super({
      transform(chunk, controller) {
        chunk = __buf + chunk;
        chunkIndex = 0;

        for (; ;) {
          const lfIndex = chunk.indexOf('\n', chunkIndex);

          if (transformOnCR(chunk, lfIndex, controller)) {
            continue;
          }

          if (lfIndex === -1) {
            // we can no longer find a line break in the chunk, break the current loop
            break;
          }

          // enqueue current line, and loop again to find next line
          let crOrLfIndex = lfIndex;
          if (chunk[lfIndex - 1] === '\r') {
            crOrLfIndex--;
          }

          const curChunk = chunk.slice(chunkIndex, crOrLfIndex);

          if (skipEmptyLines && curChunk.length === 0) {
            chunkIndex = lfIndex + 1;
            continue;
          }

          controller.enqueue(curChunk);
          chunkIndex = lfIndex + 1;
          continue;
        }

        __buf = chunk.slice(chunkIndex);
      },
      flush(controller) {
        if (__buf.length > 0) {
          // eslint-disable-next-line sukka/string/prefer-string-starts-ends-with -- performance
          if (allowCR && __buf[__buf.length - 1] === '\r') {
            controller.enqueue(__buf.slice(0, -1));
          } else {
            controller.enqueue(__buf);
          }
        }
      }
    });
  }
}

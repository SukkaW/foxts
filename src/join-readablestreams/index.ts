export function joinReadableStreams<T>(streams: Array<ReadableStream<T>>): ReadableStream<T> {
  return new ReadableStream({
    async start(controller) {
      try {
        for (let i = 0, len = streams.length; i < len; i++) {
          const stream = streams[i];
          const reader = stream.getReader();
          try {
            while (true) {
              // eslint-disable-next-line no-await-in-loop -- read chunk
              const result = await reader.read();
              if (result.done) break;
              controller.enqueue(result.value);
            }
          } finally {
            reader.releaseLock();
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    }
  });
}

export function joinReadableStreams<T>(streams: Array<ReadableStream<T>>): ReadableStream<T> {
  return new ReadableStream({
    async start(controller) {
      try {
        for (const stream of streams) {
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

import { describe, it } from 'mocha';
import { expect } from 'expect';
import { joinReadableStreams } from '.';

describe('join-readablestreams', () => {
  it('joinReadableStreams', async () => {
    const stream1 = new ReadableStream<string>({
      start(controller) {
        controller.enqueue('0');
        controller.enqueue('7');
        controller.close();
      }
    });

    const stream2 = new ReadableStream<string>({
      start(controller) {
        controller.enqueue('2');
        controller.enqueue('1');
        controller.close();
      }
    });

    const joinedStream = joinReadableStreams([stream1, stream2]);
    const reader = joinedStream.getReader();
    let result = await reader.read();
    expect(result.value).toBe('0');
    result = await reader.read();
    expect(result.value).toBe('7');
    result = await reader.read();
    expect(result.value).toBe('2');
    result = await reader.read();
    expect(result.value).toBe('1');
    result = await reader.read();
    expect(result.done).toBe(true);
  });
});

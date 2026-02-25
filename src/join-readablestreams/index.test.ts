import { describe, it } from 'mocha';
import { expect } from 'earl';
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
    expect(result.value).toEqual('0');
    result = await reader.read();
    expect(result.value).toEqual('7');
    result = await reader.read();
    expect(result.value).toEqual('2');
    result = await reader.read();
    expect(result.value).toEqual('1');
    result = await reader.read();
    expect(result.done).toEqual(true);
  });
});

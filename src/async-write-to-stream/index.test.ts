import { Writable } from 'node:stream';
import { asyncWriteToStream } from './index';
import { expect, mockFn } from 'earl';

class MockWritable extends Writable {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this -- mock
  _write(_chunk: unknown, _encoding: string, callback: (error?: Error | null) => void): void {
    callback();
  }
}

describe('asyncWriteToStream', () => {
  let stream: MockWritable;

  beforeEach(() => {
    stream = new MockWritable();
  });

  it('should return null if the stream is not under backpressure', () => {
    const result = asyncWriteToStream(stream, 'test chunk');
    expect(result).toBeNullish();
  });

  it('should return a promise if the stream is under backpressure', () => {
    stream.write = mockFn().returns(false);

    const result = asyncWriteToStream(stream, 'test chunk');
    expect(result).toBeA(Promise);
  });

  afterEach(() => {
    stream.end();
    stream.destroy();
  });
});

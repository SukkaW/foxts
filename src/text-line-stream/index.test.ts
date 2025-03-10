import { describe } from 'mocha';
import { TextLineStream } from '.';
import { expect } from 'expect';

function concatArray() {
  const chunks: string[] = [];

  return new TransformStream({
    transform(chunk) {
      chunks.push(chunk);
    },
    flush(controller) {
      controller.enqueue(chunks);
    }
  });
}

describe('text-line-stream', () => {
  it('split two lines on end', async () => {
    const { readable, writable } = new TextLineStream();

    const readStream = readable
      .pipeThrough(concatArray());

    const writer = writable.getWriter();
    writer.write('hello\nworld');
    writer.close();

    // eslint-disable-next-line no-unreachable-loop -- async iterator
    for await (const list of readStream) {
      return expect(list).toEqual(['hello', 'world']);
    }
  });

  it('split two lines on two writes', async () => {
    const { readable, writable } = new TextLineStream();

    const readStream = readable
      .pipeThrough(concatArray());

    const writer = writable.getWriter();
    writer.write('hello');
    writer.write('\nworld');
    writer.close();

    // eslint-disable-next-line no-unreachable-loop -- async iterator
    for await (const list of readStream) {
      expect(list).toEqual(['hello', 'world']);
      return;
    }
  });

  it('split four lines on three writes', async () => {
    const { readable, writable } = new TextLineStream();

    const readStream = readable
      .pipeThrough(concatArray());

    const writer = writable.getWriter();
    writer.write('hello\nwor');
    writer.write('ld\nbye\nwo');
    writer.write('rld');
    writer.close();

    // eslint-disable-next-line no-unreachable-loop -- async iterator
    for await (const list of readStream) {
      expect(list).toEqual(['hello', 'world', 'bye', 'world']);
      return;
    }
  });

  it('accumulate multiple writes', async () => {
    const { readable, writable } = new TextLineStream();

    const readStream = readable
      .pipeThrough(concatArray());

    const writer = writable.getWriter();
    writer.write('hello');
    writer.write('world');
    writer.close();

    // eslint-disable-next-line no-unreachable-loop -- async iterator
    for await (const list of readStream) {
      expect(list).toEqual(['helloworld']);
      return;
    }
  });

  // it('support a mapper function', async () => {
  //   const { readable, writable } = new TextLineStream({
  //     mapperFun: JSON.parse
  //   });

  //   const readStream = readable
  //     .pipeThrough(concatArray());

  //   const a = { a: '42' };
  //   const b = { b: '24' };

  //   const writer = writable.getWriter();
  //   writer.write(JSON.stringify(a));
  //   writer.write('\n');
  //   writer.write(JSON.stringify(b));
  //   writer.close();

  //   for await (const list of readStream) {
  //     expect(list).toEqual([a, b]);
  //     return;
  //   }
  // });

  it('split lines windows-style', async () => {
    const { readable, writable } = new TextLineStream();

    const readStream = readable
      .pipeThrough(concatArray());

    const writer = writable.getWriter();
    writer.write('hello\r\nworld');
    writer.close();

    // eslint-disable-next-line no-unreachable-loop -- async iterator
    for await (const list of readStream) {
      expect(list).toEqual(['hello', 'world']);
      return;
    }
  });

  // it('do not return empty lines (default)', async () => {
  //   const { readable, writable } = new TextLineStream();

  //   const readStream = readable
  //     .pipeThrough(concatArray());

  //   const writer = writable.getWriter();
  //   writer.write('hello\n\nworld');
  //   writer.close();

  //   // eslint-disable-next-line no-unreachable-loop -- async iterator
  //   for await (const list of readStream) {
  //     expect(list).toEqual(['hello', 'world']);
  //     return;
  //   }
  // });

  it('return empty lines - skipEmptyLines option', async () => {
    const { readable, writable } = new TextLineStream({
      skipEmptyLines: true
    });

    const readStream = readable
      .pipeThrough(concatArray());

    const writer = writable.getWriter();
    writer.write('hello\n\nworld');
    writer.close();

    // eslint-disable-next-line no-unreachable-loop -- async iterator
    for await (const list of readStream) {
      expect(list).toEqual(['hello', 'world']);
      return;
    }
  });
});

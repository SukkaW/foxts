import { describe, it } from 'mocha';
import { expect } from 'earl';
import { FIFO } from '.';

describe('fifo', () => {
  it('should work', () => {
    const fifo = new FIFO<number>();

    expect(fifo.size).toEqual(0);
    expect(fifo.peek()).toEqual(undefined);

    fifo.enqueue(1);
    expect(fifo.size).toEqual(1);
    expect(fifo.peek()).toEqual(1);

    fifo.push(2);
    expect(fifo.size).toEqual(2);
    expect(fifo.peek()).toEqual(1);

    expect(fifo.dequeue()).toEqual(1);
    expect(fifo.size).toEqual(1);
    expect(fifo.peek()).toEqual(2);

    expect(fifo.shift()).toEqual(2);
    expect(fifo.size).toEqual(0);
    expect(fifo.peek()).toEqual(undefined);

    expect(fifo.dequeue()).toEqual(undefined);
  });

  it('iterator', () => {
    const fifo = new FIFO<number>();

    fifo.enqueue(1);
    fifo.enqueue(2);
    fifo.enqueue(3);

    expect([...fifo]).toEqual([1, 2, 3]);
  });
});

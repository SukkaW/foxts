import { describe, it } from 'mocha';
import { expect } from 'expect';
import { FIFO } from '.';

describe('fifo', () => {
  it('should work', () => {
    const fifo = new FIFO<number>();

    expect(fifo.size).toBe(0);
    expect(fifo.peek()).toBe(undefined);

    fifo.enqueue(1);
    expect(fifo.size).toBe(1);
    expect(fifo.peek()).toBe(1);

    fifo.enqueue(2);
    expect(fifo.size).toBe(2);
    expect(fifo.peek()).toBe(1);

    expect(fifo.dequeue()).toBe(1);
    expect(fifo.size).toBe(1);
    expect(fifo.peek()).toBe(2);

    expect(fifo.dequeue()).toBe(2);
    expect(fifo.size).toBe(0);
    expect(fifo.peek()).toBe(undefined);

    expect(fifo.dequeue()).toBe(undefined);
  });

  it('iterator', () => {
    const fifo = new FIFO<number>();

    fifo.enqueue(1);
    fifo.enqueue(2);
    fifo.enqueue(3);

    expect([...fifo]).toEqual([1, 2, 3]);
  });
});

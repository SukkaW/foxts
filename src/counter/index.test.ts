import { expect } from 'earl';
import { describe, it } from 'mocha';

import { Counter } from '.';

describe('@remusao/counter', () => {
  describe('#constructor', () => {
    it('without argument', () => {
      const counter = new Counter();
      expect(counter.size).toEqual(0);
    });

    it('with initial iterable', () => {
      const counter = new Counter([
        ['foo', 1],
        ['bar', 2],
        ['baz', 3],
        ['bar', 1],
        ['foo', 2]
      ]);
      expect(counter.size).toEqual(3);
      expect(counter.get('foo')).toEqual(3);
      expect(counter.get('bar')).toEqual(3);
      expect(counter.get('baz')).toEqual(3);
    });

    it('with initial record', () => {
      const counter = new Counter({
        foo: 1,
        bar: 2,
        baz: 3
      });
      expect(counter.size).toEqual(3);
      expect(counter.get('foo')).toEqual(1);
      expect(counter.get('bar')).toEqual(2);
      expect(counter.get('baz')).toEqual(3);
    });
  });

  describe('#clear', () => {
    it('empty counter', () => {
      const counter = new Counter();
      counter.clear();
      expect(counter.size).toEqual(0);
    });

    it('counter with elements', () => {
      const counter = new Counter([['foo', 2]]);
      expect(counter.size).toEqual(1);
      counter.clear();
      expect(counter.size).toEqual(0);
    });
  });

  describe('#delete', () => {
    it('key which does not exist', () => {
      const counter = new Counter();
      expect(counter.delete('foo')).toEqual(false);
    });

    it('key which exists', () => {
      const counter = new Counter([['foo', 1]]);
      expect(counter.delete('foo')).toEqual(true);
      expect(counter.size).toEqual(0);
    });
  });

  describe('#has', () => {
    it('key which does not exist', () => {
      const counter = new Counter();
      expect(counter.has('foo')).toEqual(false);
    });

    it('key which exists', () => {
      const counter = new Counter([['foo', 1]]);
      expect(counter.has('foo')).toEqual(true);
    });
  });

  describe('#get', () => {
    it('key which does not exist', () => {
      const counter = new Counter();
      expect(counter.get('foo')).toEqual(0);
    });

    it('key which exists', () => {
      const counter = new Counter([['foo', 42]]);
      expect(counter.get('foo')).toEqual(42);
    });
  });

  describe('#incr', () => {
    it('key which does not exist', () => {
      const counter = new Counter();
      expect(counter.incr('foo').get('foo')).toEqual(1);
    });

    it('key which exists', () => {
      const counter = new Counter([['foo', 1]]);
      expect(counter.incr('foo').incr('foo').get('foo')).toEqual(3);
    });

    it('key with custom increment', () => {
      const counter = new Counter();
      expect(counter.incr('foo', 2).incr('foo', 0).get('foo')).toEqual(2);
    });

    it('rejects negative increments', () => {
      const counter = new Counter();
      expect(() => counter.incr('foo', -1)).toThrow(
        'Counter#incr only accepts positive values: -1'
      );
    });
  });

  describe('#decr', () => {
    it('key which does not exist', () => {
      const counter = new Counter();
      expect(counter.decr('foo').get('foo')).toEqual(0);
      expect(counter.size).toEqual(0);
    });

    it('key which exists', () => {
      const counter = new Counter([['foo', 2]]);
      expect(counter.decr('foo').get('foo')).toEqual(1);
      expect(counter.size).toEqual(1);
    });

    it('deletes key if count was 1', () => {
      const counter = new Counter();
      expect(counter.incr('foo').decr('foo').get('foo')).toEqual(0);
      expect(counter.has('foo')).toEqual(false);
      expect(counter.size).toEqual(0);
    });

    it('key with custom decrement = 0', () => {
      const counter = new Counter([['foo', 2]]);
      expect(counter.decr('foo', 0).get('foo')).toEqual(2);
    });

    it('key with custom decrement', () => {
      const counter = new Counter([['foo', 2]]);
      expect(counter.decr('foo', 2).get('foo')).toEqual(0);
      expect(counter.has('foo')).toEqual(false);
    });

    it('rejects negative decrement', () => {
      const counter = new Counter();
      expect(() => counter.decr('foo', -1)).toThrow(
        'Counter#decr only accepts positive values: -1'
      );
    });
  });

  describe('#entries', () => {
    it('returns empty if counter has not element', () => {
      const counter = new Counter();
      expect([...counter.entries()]).toBeEmpty();
    });

    it('returns elements', () => {
      const counter = new Counter<string>([
        ['foo', 2],
        ['bar', 3]
      ]);
      counter.incr('baz', 3);
      expect([...counter.entries()]).toEqual([
        ['foo', 2],
        ['bar', 3],
        ['baz', 3]
      ]);
    });
  });

  describe('#keys', () => {
    it('returns empty if counter has not element', () => {
      const counter = new Counter();
      expect([...counter.keys()]).toBeEmpty();
    });

    it('returns keys', () => {
      const counter = new Counter<string>([
        ['foo', 2],
        ['bar', 3]
      ]);
      counter.incr('baz', 3);
      expect([...counter.keys()]).toEqual(['foo', 'bar', 'baz']);
    });
  });
});

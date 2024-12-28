'use strict';

import { expect } from 'expect';
import { Repool } from '.';

describe('reuse objects', () => {
  it('should reuse objects', () => {
    class MyObject {
      public next = null;
    }

    const instance = new Repool(() => new MyObject());
    const obj = instance.get();

    expect(obj).not.toBe(instance.get());
    expect(obj.next).toBeNull();

    instance.release(obj);

    // the internals keeps a hot copy ready for reuse
    // putting this one back in the queue
    instance.release(instance.get());

    // comparing the old one with the one we got
    // never do this in real code, after release you
    // should never reuse that instance
    expect(obj).toBe(instance.get());
  });
});

describe('reuse more than 2 objects', () => {
  it('should reuse more than 2 objects', () => {
    class MyObject {
      public next = null;
    }

    const instance = new Repool(() => new MyObject());
    const obj = instance.get();
    const obj2 = instance.get();
    const obj3 = instance.get();

    expect(obj.next).toBeNull();
    expect(obj2.next).toBeNull();
    expect(obj3.next).toBeNull();

    expect(obj).not.toBe(obj2);
    expect(obj).not.toBe(obj3);
    expect(obj3).not.toBe(obj2);

    instance.release(obj);
    instance.release(obj2);
    instance.release(obj3);

    // skip one
    instance.get();

    const obj4 = instance.get();
    const obj5 = instance.get();
    const obj6 = instance.get();

    expect(obj4).toBe(obj);
    expect(obj5).toBe(obj2);
    expect(obj6).toBe(obj3);
  });
});

'use strict';

import { expect } from 'earl';
import { Repool } from '.';

describe('reuse objects', () => {
  it('should reuse objects', () => {
    class MyObject {
      public next = null;
    }

    const instance = new Repool(() => new MyObject());
    const obj = instance.get();

    expect(obj).not.toExactlyEqual(instance.get());
    expect(obj.next).toBeNullish();

    instance.release(obj);

    // the internals keeps a hot copy ready for reuse
    // putting this one back in the queue
    instance.release(instance.get());

    // comparing the old one with the one we got
    // never do this in real code, after release you
    // should never reuse that instance
    expect(obj).toExactlyEqual(instance.get());
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

    expect(obj.next).toBeNullish();
    expect(obj2.next).toBeNullish();
    expect(obj3.next).toBeNullish();

    expect(obj).not.toExactlyEqual(obj2);
    expect(obj).not.toExactlyEqual(obj3);
    expect(obj3).not.toExactlyEqual(obj2);

    instance.release(obj);
    instance.release(obj2);
    instance.release(obj3);

    // skip one
    instance.get();

    const obj4 = instance.get();
    const obj5 = instance.get();
    const obj6 = instance.get();

    expect(obj4).toEqual(obj);
    expect(obj5).toEqual(obj2);
    expect(obj6).toEqual(obj3);
  });
});

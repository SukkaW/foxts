export class Counter<K extends string> {
  private readonly map = new Map<K, number>();

  constructor(init?: Array<[K, number]> | Record<K, number>) {
    if (Array.isArray(init)) {
      for (const [key, count] of init) {
        this.incr(key, count);
      }
    } else if (init !== undefined) {
      for (const key in init) {
        // eslint-disable-next-line prefer-object-has-own -- backwards compat
        if (Object.prototype.hasOwnProperty.call(init, key)) {
          this.incr(key, init[key]);
        }
      }
    }
  }

  forEach(callbackfn: (value: number, key: K, map: Map<K, number>) => void, thisArg?: any): void {
    this.map.forEach(callbackfn, thisArg);
  }

  [Symbol.toStringTag] = 'Counter';

  get size(): number {
    return this.map.size;
  }

  public clear(): void {
    this.map.clear();
  }

  public delete(key: K): boolean {
    return this.map.delete(key);
  }

  public has(key: K): boolean {
    return this.map.has(key);
  }

  public get(key: K): number {
    const count = this.map.get(key);
    if (count === undefined) {
      return 0;
    }
    return count;
  }

  public incr(key: K, n = 1): this {
    if (n < 0) {
      throw new TypeError(`Counter#incr only accepts positive values: ${n}`);
    }

    this.map.set(key, this.get(key) + n);
    return this;
  }

  public decr(key: K, n = 1): this {
    if (n < 0) {
      throw new TypeError(`Counter#decr only accepts positive values: ${n}`);
    }

    const count = this.get(key);

    if (count <= n) {
      this.map.delete(key);
    } else {
      this.map.set(key, count - n);
    }

    return this;
  }

  public entries(): MapIterator<[K, number]> {
    return this.map.entries();
  }

  public [Symbol.iterator](): MapIterator<[K, number]> {
    return this.map[Symbol.iterator]();
  }

  public keys(): MapIterator<K> {
    return this.map.keys();
  }
}

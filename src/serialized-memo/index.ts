import { fastStringArrayJoin } from '../fast-string-array-join';
import { identity } from '../identity';
import { xxhash64 } from 'hash-wasm';
import { stringify as devalueStringify } from 'devalue';
import { noop } from '../noop';

export interface MemoizeStorageProvider {
  has(key: string): boolean | Promise<boolean>,
  get(key: string): string | undefined | PromiseLike<string | undefined>,
  set(key: string, value: string, ttl: number): void | Promise<void>,
  updateTtl?: (key: string, ttl: number) => void | Promise<void>,
  delete(key: string): void | Promise<void>
}

export interface CreateMemoizeOptions {
  /**
   * When set to true, the memoize will always try run the function first.
   * If promise resolved, it will update the cache.
   * If promise rejected, it will try to get the value from cache, and return
   * the cached value. If the cache is not available, it will throw the error.
   */
  onlyUseCachedIfFail?: boolean,
  resetTtlOnHit?: boolean,
  defaultTtl?: number,
  onCacheUpdate?: (key: string, { humanReadableName }: { humanReadableName: string, isUseCachedIfFail: boolean }) => void,
  onCacheMiss?: (key: string, { humanReadableName }: { humanReadableName: string, isUseCachedIfFail: boolean }) => void,
  onCacheHit?: (key: string, { humanReadableName }: { humanReadableName: string, isUseCachedIfFail: boolean }) => void
}

// https://github.com/Rich-Harris/devalue/blob/f3fd2aa93d79f21746555671f955a897335edb1b/src/stringify.js#L77
export type SerializableValue =
  | number
  | string
  | boolean
  | bigint
  | Date
  | RegExp
  | Set<SerializableValue>
  | SerializableValue[]
  | null
  | undefined
  | Map<SerializableValue, SerializableValue>
  | SerializableObject
  | /** TypedArray */ Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array
  | ArrayBuffer;

// Has to use an interface to avoid circular reference
interface SerializableObject {
  [key: string]: SerializableValue
}

interface MemoizeBaseOptions {
  /**
   * The time to live of the cache in milliseconds.
   */
  ttl?: number | null,
  temporaryBypass?: boolean
}

interface MemoizeOptionsWithCustomSerializer<T> extends MemoizeBaseOptions {
  serializer: (value: T) => string,
  deserializer: (cached: string) => T
}

export type MemoizeOptions<T> = T extends string ? MemoizeBaseOptions : MemoizeOptionsWithCustomSerializer<T>;

/**
 * A factory function that returns a memoize function.
 *
 * Unlike common memoize function out there, this serialize the parameters and returned value
 * for easy storing with file system, SQLite, Redis, etc.
 */
export function createMemoize(storage: MemoizeStorageProvider, {
  onlyUseCachedIfFail = false,
  resetTtlOnHit = false,
  defaultTtl = 7 * 86400 * 1000,
  onCacheUpdate = noop,
  onCacheMiss = noop,
  onCacheHit = noop
}: CreateMemoizeOptions = {}) {
  return function memoize<Args extends SerializableValue[], R>(
    fn: (...args: Args) => R | Promise<R>,
    opt?: MemoizeOptions<R>
  ): (...args: Args) => Promise<R> {
    if (opt?.temporaryBypass) {
      return (...args: Args) => Promise.resolve(fn(...args));
    }

    const serializer = opt && 'serializer' in opt ? opt.serializer : identity<Awaited<R>, string>;
    const deserializer = opt && 'deserializer' in opt ? opt.deserializer : identity<string, Awaited<R>>;
    const ttl = opt?.ttl ?? defaultTtl;

    const fixedKey = fn.toString();

    const fixedKeyHashPromise = xxhash64(fixedKey);

    return async function cachedCb(...args: Args) {
      // Construct the complete cache key for this function invocation
      // typeson.stringify is still limited. For now we uses typescript to guard the args.
      const cacheKey = fastStringArrayJoin(
        await Promise.all([
          fixedKeyHashPromise,
          xxhash64(devalueStringify(args))
        ]),
        '|'
      );

      const cacheName = fn.name || fixedKey || cacheKey;

      let cached = storage.get(cacheKey);
      if (cached && typeof cached === 'object' && 'then' in cached) {
        cached = await cached;
      }

      if (onlyUseCachedIfFail) {
        try {
          const value = await fn(...args);

          onCacheUpdate(cacheKey, { humanReadableName: cacheName, isUseCachedIfFail: true });
          const p = storage.set(cacheKey, serializer(value), ttl);
          if (p && 'then' in p) {
            await p;
          }

          return value;
        } catch (e) {
          if (cached == null) {
            onCacheMiss(cacheKey, { humanReadableName: cacheName, isUseCachedIfFail: true });
            throw e;
          }

          if (resetTtlOnHit) {
            const p = storage.updateTtl?.(cacheKey, ttl);
            if (p && 'then' in p) {
              await p;
            }
          }

          onCacheHit(cacheKey, { humanReadableName: cacheName, isUseCachedIfFail: true });

          return deserializer(cached);
        }
      } else {
        if (cached == null) {
          onCacheMiss(cacheKey, { humanReadableName: cacheName, isUseCachedIfFail: false });

          const value = await fn(...args);

          const p = storage.set(cacheKey, serializer(value), ttl);
          if (p && 'then' in p) {
            await p;
          }

          return value;
        }

        onCacheHit(cacheKey, { humanReadableName: cacheName, isUseCachedIfFail: false });

        if (resetTtlOnHit) {
          const p = storage.updateTtl?.(cacheKey, ttl);
          if (p && 'then' in p) {
            await p;
          }
        }

        return deserializer(cached);
      }
    };
  };
}

export class LazyPromise<T> extends Promise<T> {
  private promise: Promise<T> | undefined;

  constructor(private readonly executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
    // @ts-expect-error -- impl detail
    super(resolve => resolve());
  }

  static from<T>(this: void, fn: () => T | PromiseLike<T>): LazyPromise<T> {
    return new LazyPromise(resolve => {
      resolve(fn());
    });
  }

  static resolve(this: void): LazyPromise<void>;
  static resolve<T>(this: void, value: T | PromiseLike<T>): LazyPromise<T>;
  static resolve<T>(this: void, value?: T | PromiseLike<T> | void): LazyPromise<T | void> {
    return new LazyPromise<T | void>(resolve => resolve(value));
  }

  static reject<T = never>(this: void, reason?: any) {
    return new LazyPromise<T>((_, reject) => reject(reason));
  }

  // eslint-disable-next-line sukka/unicorn/no-thenable -- re-implement promise
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    this.promise ??= new Promise(this.executor);
    // eslint-disable-next-line promise/prefer-catch -- intentional
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null): Promise<T | TResult> {
    this.promise ??= new Promise(this.executor);
    return this.promise.catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<T> {
    this.promise ??= new Promise(this.executor);
    return this.promise.finally(onfinally);
  }
}

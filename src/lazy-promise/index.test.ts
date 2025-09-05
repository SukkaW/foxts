import { wait } from '../wait';
import { describe, it } from 'mocha';
import { expect } from 'expect';
import { LazyPromise } from '.';
import { noop } from '../noop';

const fixture = Symbol('fixture');

describe('PLazy', () => {
  it('executor resolves', async () => {
    const steps: string[] = [];

    const lazyPromise = new LazyPromise(resolve => {
      steps.push('executor called');
      resolve(fixture);
    });

    steps.push('promise created');

    await wait(50);

    steps.push('then called');

    await lazyPromise.then(value => {
      expect(value).toBe(fixture);
      steps.push('then-handler called');
    });

    expect(steps).toEqual([
      'promise created',
      'then called',
      'executor called',
      'then-handler called'
    ]);
  });

  it('executor rejects', async () => {
    const fixtureError = new Error('fixture');
    const steps: string[] = [];

    const lazyPromise = new LazyPromise((resolve, reject) => {
      steps.push('executor called');
      reject(fixtureError);
    });

    steps.push('promise created');

    await wait(50);

    steps.push('catch called');

    await lazyPromise.catch(error => {
      expect(error).toBe(fixtureError);
      steps.push('catch-handler called');
    });

    expect(steps).toEqual([
      'promise created',
      'catch called',
      'executor called',
      'catch-handler called'
    ]);
  });

  it('executor is never called if no `then`', async () => {
    let executorCalled = false;
    new LazyPromise<void>(resolve => { // eslint-disable-line no-new -- unit test
      executorCalled = true;
      resolve();
    });

    await wait(50);
    expect(executorCalled).toBe(false);
  });

  it('executor is called with only catch handler', async () => {
    const steps: string[] = [];

    const lazyPromise = new LazyPromise<void>(resolve => {
      steps.push('executor called');
      resolve();
    });

    steps.push('promise created');

    await wait(50);

    steps.push('catch called');

    await lazyPromise.catch(noop);

    expect(steps).toEqual([
      'promise created',
      'catch called',
      'executor called'
    ]);
  });

  it('convert promise-returning function to lazy promise', async () => {
    let called = false;

    // eslint-disable-next-line @typescript-eslint/require-await -- unit test
    const lazyPromise = LazyPromise.from(async () => {
      called = true;
      return fixture;
    });

    expect(lazyPromise).toBeInstanceOf(LazyPromise);
    expect(lazyPromise).toBeInstanceOf(Promise);
    expect(called).toBe(false);

    expect(await lazyPromise).toBe(fixture);
    expect(called).toBe(true);
  });

  it('should have static method `reject` that returns a lazy rejected promise', async () => {
    const fixtureError = new Error('fixture');
    const steps: string[] = [];

    const lazyPromise = LazyPromise.reject(fixtureError);

    steps.push('promise created');

    await wait(50);

    steps.push('catch called');

    await lazyPromise.catch(error => {
      expect(error).toBe(fixtureError);
      steps.push('catch-handler called');
    });

    expect(steps).toEqual([
      'promise created',
      'catch called',
      'catch-handler called'
    ]);
  });

  it('should have static method `resolve` that returns a lazy resolved promise', async () => {
    const lazyPromise = LazyPromise.resolve(fixture);

    expect(lazyPromise).toBeInstanceOf(LazyPromise);
    expect(lazyPromise).toBeInstanceOf(Promise);

    expect(await lazyPromise).toBe(fixture);
  });
});

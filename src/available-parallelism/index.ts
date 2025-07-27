export interface NodeOSLike {
  cpus(): any[],
  availableParallelism?: () => number
}

export interface NavigatorLike {
  hardwareConcurrency?: number
}

/**
 * Returns the number of available parallelism for the current platform.
 *
 * Usage:
 *
 * ```js
 * // with a passed in Node.js os module
 * import * as os from 'node:os';
 * import availableParallelism from 'foxts/available-parallelism';
 *
 * availableParallelism(os); // number
 *
 * // In a browser environment, it can read navigator object
 * import availableParallelism from 'foxts/available-parallelism';
 * availableParallelism(navigator); // number
 *
 * // You can dynamic import of the Node.js os module
 * import availableParallelism from 'foxts/available-parallelism';
 * await availableParallelism(import('node:os')); // number
 *
 * // If you don't pass any arguments, it will automatically detect the environment
 * import availableParallelism from 'foxts/available-parallelism';
 * await availableParallelism(); // number
 * ```
 */
export function availableParallelism(
  platform: NodeOSLike | NavigatorLike
): number;
export function availableParallelism(
  asyncNodeOS?: Promise<NodeOSLike>
): Promise<number>;
export function availableParallelism(
  platform?: NodeOSLike | NavigatorLike | Promise<NodeOSLike>
): Promise<number> | number {
  if (platform == null) {
    // no platform provided
    if (
      // @ts-expect-error -- we didn't introduce DOM type
      // this is designed for compiler/bundler bail out
      typeof window === 'object'
      && 'navigator' in globalThis
      && isNavigatorLike((globalThis as any).navigator)
    ) {
      // browser environment
      return Promise.resolve((globalThis as any).navigator.hardwareConcurrency ?? 1);
    }

    return import('node:os') // this will fail on browser with a TypeError
      .then(os => {
        if (!isNodeOSLike(os)) {
          return 1; // fallback to 1 if not an os type
        }
        return extractParallelismFromNodeOS(os);
      })
      .catch(() => 1); // fallback to 1 if import fails
  }

  if (isNodeOSLike(platform)) {
    return extractParallelismFromNodeOS(platform);
  }

  if (isNavigatorLike(platform)) {
    return platform.hardwareConcurrency ?? 1;
  }

  if ('then' in platform && typeof platform.then === 'function') {
    // If platform is a Promise
    return platform.then(extractParallelismFromNodeOS);
  }

  return 1;
}

export function isNodeOSLike(
  platform: unknown
): platform is NodeOSLike {
  return (
    typeof platform === 'object'
    && platform !== null
    && 'cpus' in platform
    && typeof platform.cpus === 'function'
  );
}

export function isNavigatorLike(
  platform: unknown
): platform is NavigatorLike {
  return (
    typeof platform === 'object'
    && platform !== null
    && 'hardwareConcurrency' in platform
    && typeof platform.hardwareConcurrency === 'number'
  );
}

function extractParallelismFromNodeOS(platform: NodeOSLike): number {
  return 'availableParallelism' in platform && typeof platform.availableParallelism === 'function'
    ? platform.availableParallelism()
    : (platform.cpus().length || 1);
}

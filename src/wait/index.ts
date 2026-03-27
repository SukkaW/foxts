export function wait(ms: number, timerUnref = false): Promise<void> {
  return new Promise<void>(resolve => {
    const timer = setTimeout(resolve, ms);
    if (timerUnref && typeof timer === 'object' && 'unref' in timer && typeof timer.unref === 'function') {
      timer.unref();
    }
  });
}

export function waitWithAbort(ms: number, signal: AbortSignal | undefined | null, timerUnref = false): Promise<void> {
  if (!signal) {
    return wait(ms, timerUnref);
  }

  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason as Error);
      return;
    }

    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();

      if (timerUnref && typeof timer === 'object' && 'unref' in timer && typeof timer.unref === 'function') {
        timer.unref();
      }
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      reject(signal?.reason as Error);
    };

    signal.addEventListener('abort', onAbort, { once: true });
  });
}

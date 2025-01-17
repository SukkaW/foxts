export function wait(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    // eslint-disable-next-line sukka/prefer-timer-id -- hang timers
    setTimeout(resolve, ms);
  });
}

export function waitWithAbort(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason as Error);
      return;
    }

    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      reject(signal.reason as Error);
    };

    signal.addEventListener('abort', onAbort);
  });
}

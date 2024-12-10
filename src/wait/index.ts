export function wait(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    // eslint-disable-next-line sukka/prefer-timer-id -- hang timers
    setTimeout(resolve, ms);
  });
}

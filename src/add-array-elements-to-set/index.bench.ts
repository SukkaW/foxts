(async () => {
  const { bench, group, run } = await import('mitata');

  const data = (await (await fetch('https://osint.digitalside.it/Threat-Intel/lists/latestdomains.txt')).text()).split('\n');

  group(() => {
    bench('for loop', () => {
      const set = new Set(['1', '2', '1', '3', 'skk.moe']);
      for (let i = 0, len = data.length; i < len; i++) {
        set.add(data[i]);
      }
    });
    bench('Array#forEach w/ bound function', () => {
      const set = new Set(['1', '2', '1', '3', 'skk.moe']);
      // eslint-disable-next-line @typescript-eslint/unbound-method -- thisArg is passed
      data.forEach(set.add, set);
    });
    bench('Array#forEach w/o bound function', () => {
      const set = new Set(['1', '2', '1', '3', 'skk.moe']);
      const add = (item: string) => set.add(item);

      data.forEach(add);
    });
  });

  run();
})();

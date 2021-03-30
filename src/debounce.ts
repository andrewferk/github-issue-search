const debounce = <T extends (...args: any) => any>(fn: T, delay: number) => {
  let tid = 0;
  const run = (...args: Parameters<T>) => {
    clearTimeout(tid);
    tid = window.setTimeout(() => fn.apply(fn, args), delay);
  };
  run.cancel = () => clearTimeout(tid);
  return run;
};

export default debounce;

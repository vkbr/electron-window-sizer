export function debounce<T extends Array<unknown>, U>(
  fn: (...args: T) => U,
): (...args: T) => void {
  let timer: NodeJS.Timeout | null;

  return (...args: T) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, 0);
  };
}

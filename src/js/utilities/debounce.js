export default (fn, delay) => {
  let timerId;

  return (...args) => {
    if (timerId) {
      window.clearTimeout(timerId);
    }

    timerId = window.setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
};

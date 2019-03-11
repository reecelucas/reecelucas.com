export default (fn: () => void, ms: number) => {
  let id;

  id = setTimeout(() => {
    clearTimeout(id);
    fn();
  }, ms);
};

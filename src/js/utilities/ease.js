// Taken from: https://bit.ly/2OXbvXg
export default ({
  startValue = 0,
  endValue = 1,
  durationMs = 400,
  onStep,
  onComplete = () => {}
}) => {
  const raf =
    window.requestAnimationFrame || (func => window.setTimeout(func, 16));

  const stepCount = durationMs / 16;
  const valueIncrement = (endValue - startValue) / stepCount;
  const sinValueIncrement = Math.PI / stepCount;

  let currentValue = startValue;
  let currentSinValue = 0;

  function step() {
    currentSinValue += sinValueIncrement;
    currentValue += valueIncrement * Math.sin(currentSinValue) ** 2 * 2;

    if (currentSinValue < Math.PI) {
      onStep(currentValue);
      raf(step);
    } else {
      onStep(endValue);
      onComplete();
    }
  }

  raf(step);
};

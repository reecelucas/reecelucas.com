/**
 * This serves as a crude `:focus-visible` polyfill.
 * When the user tabs, we take this as an indication that they are
 * using the keyboard to navigate, so we preserve the default
 * focus outline styling.
 */
const onFirstTabPress = (event: KeyboardEvent): void => {
  if (event.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', onFirstTabPress);
  }
};

export default (): void => {
  window.addEventListener('keydown', onFirstTabPress);
};

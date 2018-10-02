export default (
  element,
  { x = window.pageXOffset, y = window.pageYOffset }
) => {
  element.focus();

  if (document.activeElement !== element) {
    /**
     * If the element is not natively focussable, we add tabindex
     * (to enable focus) & then set focus.
     */
    element.setAttribute('tabindex', '-1');
    element.focus();
  }

  // Allow custom scroll position (to override browser 'snapping" behaviour)
  window.scrollTo(x, y);
};

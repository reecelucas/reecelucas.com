const scroller = document.querySelector('[data-scroller]');
const speedFactor = scroller ? scroller.children.length : 0;

let lastScrollX = 0;
let scrollX = 0;
let mouseDown = false;
let ticking = false;

const updateScrollPosition = () => {
  const scrollAmount = (scrollX - lastScrollX) / speedFactor;
  scroller.scrollLeft += scrollAmount;
  ticking = false;
};

const onMouseDown = event => {
  event.preventDefault();

  mouseDown = true;
  scrollX = event.pageX;
};

const onMouseMove = ({ pageX }) => {
  if (!ticking && mouseDown) {
    ticking = true;
    window.requestAnimationFrame(updateScrollPosition);
    lastScrollX = pageX;
  }
};

const onMouseUp = () => {
  mouseDown = false;
};

export default () => {
  if (!scroller) return;

  scroller.addEventListener('mousedown', onMouseDown);
  scroller.addEventListener('mousemove', onMouseMove);
  scroller.addEventListener('mouseup', onMouseUp);
  scroller.addEventListener('mouseleave', onMouseUp);
};

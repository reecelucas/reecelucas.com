const config = {
  selector: '[data-observe]',
  isVisibleClass: 'is-visible',
  observerOptions: {
    threshold: 0,
    rootId: null,
    rootMargin: '0px 0px 0px 0px',
    once: true
  }
};

let observer = null;

const addIsVisibleClass = element => {
  element.classList.add(config.isVisibleClass);
};

const removeIsVisibleClass = element => {
  element.classList.remove(config.isVisibleClass);
};

const onEntry = entries => {
  const { threshold, once } = config.observerOptions;

  entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
    if (isIntersecting && intersectionRatio > threshold) {
      addIsVisibleClass(target);

      if (once) {
        // We can stop observing now that the element is visible
        observer.unobserve(target);
      }
    } else {
      removeIsVisibleClass(target);
    }
  });
};

const createObserverInstance = () => {
  const { rootId, rootMargin, threshold } = config.observerOptions;

  return new IntersectionObserver(onEntry, {
    root: rootId ? document.getElementById(rootId) : null,
    rootMargin,
    threshold
  });
};

const observeElements = (elements, observerInstance) => {
  if (
    !Array.isArray(elements) ||
    !(observerInstance instanceof IntersectionObserver)
  ) {
    return;
  }

  elements.forEach(element => {
    observerInstance.observe(element);
  });
};

export default () => {
  const elements = [...document.querySelectorAll(config.selector)];

  if (!elements || elements.length === 0) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    elements.forEach(element => {
      addIsVisibleClass(element);
    });

    return;
  }

  observer = createObserverInstance();
  observeElements(elements, observer);
};

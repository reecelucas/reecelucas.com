import debounce from '../utilities/debounce';
import setFocus from '../utilities/set-focus';
import ease from '../utilities/ease';

const config = {
  headerSelector: '[data-header]',
  navSelector: '[data-nav]',
  navItemSelector: '[data-nav-item]',
  activeClass: 'is-active'
};

const header = document.querySelector(config.headerSelector);
const nav = document.querySelector(config.navSelector);
const navItems = [...document.querySelectorAll(config.navItemSelector)];
const navHeight = nav ? nav.getBoundingClientRect().height : 0;

let cache = [];
let scrollY = window.pageYOffset;
let scrollTicking = false;

/**
 * For each nav link we retrieve the matching section and its offset & height.
 * We can now reference each section on scroll without having to query the DOM
 * or perform calculations in the event handler.
 */
const cacheElements = navigationItems => {
  navigationItems.forEach(item => {
    const section = document.querySelector(item.getAttribute('href'));

    if (!section) return;

    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - navHeight;
    const cacheEntry = {
      navItem: item,
      section,
      sectionTop,
      sectionBottom: sectionTop + sectionHeight
    };

    cache = [...cache, cacheEntry];
  });
};

const headerIsSticky = () =>
  getComputedStyle(header).getPropertyValue('position') === 'fixed';

const updateActiveNavItem = (navigationItems, activeNavItem) => {
  navigationItems.forEach(item => {
    item.classList.remove(config.activeClass);
  });

  activeNavItem.classList.add(config.activeClass);
};

const setInitialActiveNavItem = (urlHash, navigationItems) => {
  navigationItems.forEach(item => {
    const itemHash = item.getAttribute('href');

    /**
     * If the url hash is equal to the url value of the nav item,
     * Set it as active.
     */
    if (itemHash === urlHash) {
      updateActiveNavItem(navItems, item);
    }
  });
};

/**
 * Loop through the cache array, check the scroll position against
 * each links' matching section; adding the active state if the matching
 * section is within the viewport.
 */
const updateNavItems = () => {
  cache.forEach(entry => {
    const { navItem, sectionTop, sectionBottom } = entry;

    if (sectionTop <= scrollY && sectionBottom > scrollY) {
      updateActiveNavItem(navItems, navItem);
    } else {
      navItem.classList.remove(config.activeClass);
    }
  });

  scrollTicking = false;
};

const resetNavItems = () => {
  cache.forEach(({ navItem }) => {
    navItem.classList.remove(config.activeClass);
  });
};

const onScroll = () => {
  if (!scrollTicking) {
    scrollTicking = true;
    window.requestAnimationFrame(updateNavItems);
    scrollY = window.pageYOffset;
  }
};

const onClick = event => {
  const { target } = event;

  if (target && target.matches(config.navItemSelector)) {
    event.preventDefault();

    const hash = target.getAttribute('href');
    const section = document.querySelector(hash);

    if (!section || target.classList.contains(config.activeClass)) return;

    /**
     * Unbind scroll handler so that the active class isn't
     * applied to the nav items as the page is scroll-jacked.
     */
    document.removeEventListener('scroll', onScroll);
    updateActiveNavItem(navItems, target);

    const sectionTop = section.offsetTop - navHeight;

    ease({
      startValue: window.pageYOffset,
      endValue: sectionTop,
      durationMs: 450,
      onStep: value => window.scroll(0, value),
      onComplete: () => {
        setFocus(section, { y: sectionTop });
        document.addEventListener('scroll', onScroll);

        if (window.history && window.history.pushState) {
          // Update url with hash to ensure native anchor behaviour is persisted
          window.history.pushState(null, null, hash);
        }
      }
    });
  }
};

const onResize = () => {
  document.removeEventListener('click', onClick);
  document.removeEventListener('scroll', onScroll);
  resetNavItems();

  if (headerIsSticky()) {
    // Rebind event handlers and update cached sizes and dimensions
    document.addEventListener('click', onClick);
    document.addEventListener('scroll', onScroll);

    cacheElements(navItems);
    updateNavItems();
  }
};

export default () => {
  if (!header || !nav || !navItems || navItems.length === 0) return;

  if (headerIsSticky()) {
    setInitialActiveNavItem(window.location.hash, navItems);
    cacheElements(navItems);

    document.addEventListener('click', onClick);
    document.addEventListener('scroll', onScroll);
  }

  window.addEventListener('resize', debounce(100, onResize));
};

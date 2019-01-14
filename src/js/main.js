import './utilities/raf-polyfill';

import registerSw from './modules/register-sw';
import manageFocusState from './modules/manage-focus-state';
import lazyload from './modules/lazy-load';
import trackingNav from './modules/tracking-nav';
import dragScroll from './modules/drag-scroll';

registerSw();
manageFocusState();

lazyload.init();
trackingNav();
dragScroll();

import manageFocusState from './utilities/manage-focus-state';
import registerSw from './utilities/register-sw';
import trackingNav from './modules/tracking-nav';
import observeVisibility from './modules/observe-visibility';
import dragScroll from './modules/drag-scroll';
import lazyload from './modules/lazy-load';

registerSw();
manageFocusState();

lazyload.init();
trackingNav();
observeVisibility();
dragScroll();

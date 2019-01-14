import './utilities/raf-polyfill';

import manageFocusState from './modules/manage-focus-state';
import registerSw from './modules/register-sw';
import trackingNav from './modules/tracking-nav';
import dragScroll from './modules/drag-scroll';

registerSw();
manageFocusState();

trackingNav();
dragScroll();

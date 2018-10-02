import manageFocusState from './utilities/manage-focus-state';
import registerSw from './utilities/register-sw';
import trackingNav from './modules/tracking-nav';
import formValidation from './modules/form-validation';
import observeVisibility from './modules/observe-visibility';
import dragScroll from './modules/drag-scroll';

registerSw();
manageFocusState();

trackingNav();
formValidation();
observeVisibility();
dragScroll();

import lazily from 'lazily.js';

export default lazily({
  selector: '[data-lazyload]',
  loadClass: 'has-loaded',
  errorClass: 'has-error',
  rootMargin: '0px 0px 200px 0px'
});

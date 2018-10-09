import lazily from 'lazily.js';

export default lazily({
  selector: '[data-lazyload]',
  loadClass: 'has-loaded',
  errorClass: 'has-error'
});

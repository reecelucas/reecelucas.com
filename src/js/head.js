import {
  fetchFromLocalStorage,
  saveToLocalStorage
} from './utilities/local-storage';

const loadedClass = 'fonts-loaded';
const addLoadedClass = () => {
  document.documentElement.className += ` ${loadedClass}`;
};

if (fetchFromLocalStorage(loadedClass)) {
  /**
   * Note: if the font is never cached, or the user clears their cache (but
   * not their local storage), this check will still pass and the `fonts-loaded`
   * styling will be added before the webfont is available. This feels very "edge-casey"
   * so is probably not worth guarding against.
   */
  console.log('fetchFromLocalStorage(loadedClass) = true');
  addLoadedClass();
} else if ('fonts' in document) {
  console.log('else if ("fonts" in document)');
  const fontHeading = new FontFace(
    'EB Garamond',
    "url(/assets/fonts/eb-garamond-regular.woff2) format('woff2'), url(/assets/fonts/eb-garamond-regular.woff) format('woff')"
  );

  fontHeading
    .load()
    .then(font => {
      document.fonts.add(font);
      addLoadedClass();
      saveToLocalStorage({
        key: loadedClass,
        value: true,
        expirationDays: 364 // Font files are cached for a year (see `_headers`)
      });
    })
    .catch(console.warn);
} else {
  console.log('head.js fallback');
  const script = document.createElement('script');
  script.src = '/js/font-loading-fallback.js';
  script.async = true;
  document.head.appendChild(script);
}

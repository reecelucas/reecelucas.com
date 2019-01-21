import {
  fetchFromLocalStorage,
  saveToLocalStorage
} from './utilities/local-storage';

const loadedClass = 'fonts-loaded';
const addLoadedClass = () => {
  document.documentElement.className += ` ${loadedClass}`;
};

if (fetchFromLocalStorage(loadedClass)) {
  addLoadedClass();
} else if ('fonts' in document) {
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
        expirationDays: 364
      });
    })
    .catch(console.warn);
} else {
  const script = document.createElement('script');
  script.src = '/js/font-loading-fallback.js';
  script.async = true;
  document.head.appendChild(script);
}

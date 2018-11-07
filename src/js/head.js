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
  Promise.all([
    document.fonts.load("400 1em 'Nunito'"),
    document.fonts.load("700 1em 'Nunito'"),
    document.fonts.load("400 1em 'Libre Baskerville'")
  ])
    .then(() => {
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

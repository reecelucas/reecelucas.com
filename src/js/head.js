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
  const fontRegular = new FontFace(
    'HKGrotesk',
    "url(/assets/fonts/HKGrotesk-Regular.woff2) format('woff2'), url(/assets/fonts/HKGrotesk-Regular.woff) format('woff')",
    { weight: '400' }
  );

  const fontBold = new FontFace(
    'HKGrotesk',
    "url(/assets/fonts/HKGrotesk-Bold.woff2) format('woff2'), url(/assets/fonts/HKGrotesk-Bold.woff) format('woff')",
    { weight: '700' }
  );

  Promise.all([fontRegular.load(), fontBold.load()])
    .then(loadedFonts => {
      // Render fonts at the same time to avoid multiple repaints
      loadedFonts.forEach(font => {
        document.fonts.add(font);
      });

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

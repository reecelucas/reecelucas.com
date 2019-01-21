import FontFaceObserver from 'fontfaceobserver';
import { saveToLocalStorage } from './utilities/local-storage';

const loadedClass = 'fonts-loaded';
const font = new FontFaceObserver('EB Garamond', { weight: 400 });

font
  .load(null, 5000)
  .then(() => {
    document.documentElement.className += ` ${loadedClass}`;
    saveToLocalStorage({
      key: loadedClass,
      value: true,
      expirationDays: 364
    });
  })
  .catch(console.warn);

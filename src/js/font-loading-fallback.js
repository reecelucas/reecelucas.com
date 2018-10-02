import 'fontfaceobserver';
import { saveToLocalStorage } from './utilities/local-storage';

const loadedClass = 'fonts-loaded';
const fontA = new window.FontFaceObserver('Nunito', { weight: 400 });
const fontB = new window.FontFaceObserver('Nunito', { weight: 700 });
const fontC = new window.FontFaceObserver('EB Garamond', { weight: 400 });

Promise.all([
  fontA.load(null, 5000),
  fontB.load(null, 5000),
  fontC.load(null, 5000)
])
  .then(() => {
    document.documentElement.className += ` ${loadedClass}`;
    saveToLocalStorage({
      key: loadedClass,
      value: true,
      expirationDays: 364
    });
  })
  .catch(console.warn);

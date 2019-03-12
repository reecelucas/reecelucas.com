const fs = require('fs');
const util = require('util');
const path = require('path');
const { inlineSource } = require('inline-source');
const purify = require('purify-css');
const writeFile = util.promisify(fs.writeFile);

const ROOT = `${__dirname}/../dist/`;
const HTML_PATH = path.resolve(`${ROOT}index.html`);
const SELECTOR_WHITELIST = [
  'user-is-tabbing',
  '*is-*',
  '*has-*',
  '*no-*',
  '*form-message*'
];

const purifyCSS = async (source, context) => {
  try {
    if (source.fileContent && source.type === 'css' && !source.content) {
      const htmlString = context.html;
      const cssString = source.fileContent;

      /**
       * Replace the content of the CSS file with the purified CSS
       * before inlining it into a style tag.
       */
      source.content = purify(htmlString, cssString, {
        minify: true,
        whitelist: SELECTOR_WHITELIST
      });
      source.tag = 'style';
    }

    return Promise.resolve();
  } catch (error) {
    throw new Error(error);
  }
};

(async () => {
  try {
    const transformedHTML = await inlineSource(HTML_PATH, {
      attribute: 'data-inline',
      compress: false,
      handlers: [purifyCSS],
      rootpath: ROOT
    });

    await writeFile(HTML_PATH, transformedHTML);
  } catch (error) {
    throw new Error(error);
  }
})();

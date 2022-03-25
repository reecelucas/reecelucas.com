const postcss = require("postcss");
const postcssImport = require("postcss-import");
const postcssCustomMedia = require("postcss-custom-media");
const htmlmin = require("html-minifier");
const esbuild = require("esbuild");
const { minify } = require("csso");

module.exports = function (eleventyConfig) {
  const SRC_DIR = "src";
  const OUT_DIR = "dist";
  const INDEX_CSS_PATH = `${SRC_DIR}/_includes/styles/index.css`;
  const IS_PROD = process.env.ELEVENTY_ENV === "production";

  // Pass all files in the `public` directory to the `OUT_DIR`
  eleventyConfig.addPassthroughCopy({
    "public/**/*": "../dist",
  });

  // Make sure Elleventy watches TS files and triggers a build when they change.
  // Bundling is handled by `esbuild` after the Elleventy build ends.
  eleventyConfig.addWatchTarget(`${SRC_DIR}/scripts/`);

  // Transform CSS with PostCSS plugins: {{ css | postcss }}
  eleventyConfig.addNunjucksAsyncFilter("postcss", (css, callback) => {
    postcss([postcssImport, postcssCustomMedia])
      .process(css, { from: INDEX_CSS_PATH })
      .then((result) => callback(null, result.css));
  });

  // Minify CSS in production: {{ css | cssmin }}
  eleventyConfig.addFilter("cssmin", (code) =>
    IS_PROD ? minify(code).css : code
  );

  // Bundle TS with `esbuild` after the Elleventy build ends
  eleventyConfig.on("eleventy.after", () =>
    esbuild.build({
      entryPoints: [`${SRC_DIR}/scripts/index.ts`],
      bundle: true,
      target: "es2015", // ES6
      outdir: OUT_DIR,
      minify: IS_PROD,
      sourcemap: !IS_PROD,
    })
  );

  if (IS_PROD) {
    // Minify HTML during the Elleventy build
    eleventyConfig.addTransform("htmlmin", function (content) {
      if (this.outputPath && this.outputPath.endsWith(".html")) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          sortAttributes: true,
          sortClassName: true,
        });

        return minified;
      }

      return content;
    });
  }

  return {
    dir: { input: SRC_DIR, output: OUT_DIR },
  };
};

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter('preventOrphan', string => {
    const words = string.split(' ');
    const [first, second] = words.slice(-2);

    // Join last two words with `&nbsp;`
    const lastTwoWordsJoined = `${first}\u00A0${second}`;
    return [...words.slice(0, words.length - 2), lastTwoWordsJoined].join(' ');
  });

  return {
    pathPrefix: '/',
    dir: {
      input: 'src/views',
      output: 'dist'
    }
  };
};

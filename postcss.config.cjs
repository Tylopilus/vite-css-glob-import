module.exports = {
  plugins: [
    require('postcss-import-ext-glob'),
    require('./postcss-plugin.cjs'),
  ],
};

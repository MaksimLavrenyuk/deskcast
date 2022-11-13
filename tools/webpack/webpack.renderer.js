const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

module.exports = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
      // fs: require.resolve('browserify-fs'),
      // stream: require.resolve('stream-browserify'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
  externals: { fs: 'commonjs fs' },
  stats: 'minimal',
};

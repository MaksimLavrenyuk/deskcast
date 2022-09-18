const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const srcFile = require.resolve('./src/index.ts');
const htmlTemplate = require.resolve('./index.html');

console.log(srcFile);

module.exports = {
  mode: 'development',
  entry: srcFile,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: htmlTemplate,
    }),
  ],
};

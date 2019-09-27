const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: {
    background: './src/background.js',
    content: './src/content.js',
    options: './src/options.js',
    popup: './src/popup.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(['static']),
  ],
}

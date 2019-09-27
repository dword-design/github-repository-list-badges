const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeEnv = require('@dword-design/node-env')

module.exports = {
  mode: nodeEnv,
  context: __dirname,
  devtool: false,
  entry: {
    background: './src/background.js',
    content: './src/content.js',
    options: './src/options.js',
    popup: './src/popup.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(['static'], { copyUnmodified: true }),
  ],
}

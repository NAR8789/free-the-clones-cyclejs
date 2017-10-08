const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ProgressBarPlugin(),
    new WebpackNotifierPlugin(),
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'public')],
  },
}

var webpack = require('webpack');
var path = require('path');
var baseConfig = require('./webpack.config');

var config = Object.create(baseConfig);
config.devtool = 'cheap-module-eval-source-map';
config.entry = [
  'webpack-hot-middleware/client',
  path.join(__dirname, 'app'),
],
config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
];

module.exports = config;

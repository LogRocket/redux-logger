var webpack = require('webpack');
var baseConfig = require('./webpack.config');

var config = Object.create(baseConfig);
config.plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
];

module.exports = config;

var webpack = require('webpack');
var path = require('path');
var baseConfig = require('./webpack.config');

var config = Object.create(baseConfig);
config.output = {
  path: path.join(__dirname, 'dist'),
  filename: 'bundle.js',
  publicPath: '/dist/'
};
config.plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      screw_ie8: true,
      warnings: false
    }
  })
];

module.exports = config;

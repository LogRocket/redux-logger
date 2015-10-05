var webpack = require('webpack');
var path = require('path');
var baseConfig = require('./webpack.config');
var HtmlWebpackPlugin = require('html-webpack-plugin')

var config = Object.create(baseConfig);
config.plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new HtmlWebpackPlugin({
    template: 'index.production.tpl'
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      screw_ie8: true,
      warnings: false
    }
  })
];

module.exports = config;

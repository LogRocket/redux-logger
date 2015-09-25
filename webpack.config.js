const webpack = require('webpack');
const path    = require('path');

module.exports = {
  entry: [
    './src/index',
  ],
  output: {
    library: process.env.LIBRARY_NAME,
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
    ],
  }
}

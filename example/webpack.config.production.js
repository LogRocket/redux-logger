var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './example/app'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      'redux-logger': path.join(__dirname, '..'),
      'components': path.join(__dirname, 'components'),
      'styles': path.join(__dirname, 'styles')
    },
    extensions: ['', '.js', '.jsx', '.scss']
  },
  module: {
    loaders: [{
      test: /(.js|.jsx)/,
      loaders: ['babel'],
      include: [
        __dirname,
        path.join(__dirname, '..', 'src')
      ]
    }, {
      test: /\.scss$/,
      loader: 'style!css!sass',
      include: [
        path.join(__dirname, '..', 'styles'),
        path.join(__dirname, 'styles')
      ]
    }]
  }
};

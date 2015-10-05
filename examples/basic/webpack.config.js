var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    path.join(__dirname, 'app'),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.[hash].js',
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      'redux-logger': path.join(__dirname, '..', '..'),
      'actions': path.join(__dirname, 'actions'),
      'constants': path.join(__dirname, 'constants'),
      'containers': path.join(__dirname, 'containers'),
      'reducers': path.join(__dirname, 'reducers'),
      'styles': path.join(__dirname, 'styles'),
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

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:7000',
    'webpack/hot/only-dev-server',
    './app'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
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
      loaders: ['react-hot', 'babel'],
      exclude: /node_modules/,
      include: __dirname
    }, {
      test: /(.js|.jsx)/,
      loaders: ['babel'],
      include: path.join(__dirname, '..', 'src')
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

import webpack from 'webpack';
import path from 'path';

export default {
  entry: [
    path.join(__dirname, `src`, `index`),
  ],
  output: {
    path: path.join(__dirname, `build`),
  },
  module: {
    noParse: [`node_modules/react`],
    loaders: [
      { test: /(.js|.jsx)/, exclude: /node_modules/, loaders: [`babel?cacheDirectory=true`] },
    ],
  },
  stats: {
    colors: true,
  },
  resolve: {
    root: path.join(__dirname, `src`),
    alias: {
      'redux-logger': path.join(__dirname, `..`, `src`),
    },
    extensions: [``, `.js`, `.json`, `.jsx`, `.css`, `.svg`],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

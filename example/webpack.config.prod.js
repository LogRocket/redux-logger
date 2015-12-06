import path from 'path';
import config from './webpack.config.shared';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  ...config,
  output: {
    ...config.output,
    filename: `app.[hash].js`,
  },
  module: {
    ...config.module,
    loaders: [
      ...config.module.loaders,
      { test: /\.css/, loader: ExtractTextPlugin.extract(`style`, `css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss`) },
    ],
  },
  plugins: [
    ...config.plugins,
    new HtmlWebpackPlugin({
      template: path.join(__dirname, `src`, `index.production.html`),
    }),
    new ExtractTextPlugin(`app.[contenthash].css`, {
      allChunks: true,
    }),
  ],
};

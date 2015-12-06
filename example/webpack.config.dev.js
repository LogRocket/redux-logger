import config from './webpack.config.shared';

export default {
  ...config,
  entry: [
    ...config.entry,
    `webpack-hot-middleware/client`,
  ],
  output: {
    ...config.output,
    filename: `index.js`,
    publicPath: `/`,
  },
  module: {
    ...config.module,
    loaders: [
      ...config.module.loaders,
      { test: /\.css/, loader: `style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss` },
    ],
  },
  devtool: `cheap-module-eval-source-map`,
};

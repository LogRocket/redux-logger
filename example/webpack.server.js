const path        = require('path');
const express     = require('express');
const webpack     = require('webpack');
const config      = require('./webpack.config.dev');

const app = express();
const compiler = webpack(config);
const port = process.env.PORT;

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: false,
  publicPath: config.output.publicPath,
  contentBase: path.join(__dirname, 'dist'),
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:' + port);
});

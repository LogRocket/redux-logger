import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from './webpack.config.dev';

const app = express();
const compiler = webpack(config);
const { PORT = 7000 } = process.env;

app.use(require(`webpack-dev-middleware`)(compiler, {
  noInfo: false,
  publicPath: config.output.publicPath,
  contentBase: `./src`,
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}));

app.use(require(`webpack-hot-middleware`)(compiler));

app.get(`*`, (req, res) => {
  res.sendFile(path.join(__dirname, `src`, `index.development.html`));
});

app.listen(PORT, `localhost`, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://localhost:%s`, PORT);
});

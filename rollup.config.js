import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [{
    exports: 'named',
    file: 'dist/redux-logger.js',
    format: 'umd',
    name: 'reduxLogger',
  }, {
    file: 'dist/redux-logger.es.js',
    format: 'es',
  }],
  plugins: [
    babel({
      babelrc: false,
      exclude: /node_modules/,
      presets: [
        [
          '@babel/env',
          {
            modules: false,
          },
        ],
      ],
    }),
    commonjs({
      include: /node_modules/,
    }),
    nodeResolve({
      mainFields: ['jsnext', 'main', 'browser'],
    }),
    terser({
      exclude: '*.es.js',
    }),
  ],
};

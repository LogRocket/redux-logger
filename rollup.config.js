import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/redux-logger.js',
    format: 'umd',
    exports: 'named',
    name: 'reduxLogger',
  },
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
      mainFields: ['module', 'jsnext', 'main', 'browser'],
    }),
    terser(),
  ],
};

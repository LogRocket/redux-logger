import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/index.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'reduxLogger',
  dest: 'dist/redux-logger.js',
  plugins: [
    babel({
      babelrc: false,
      presets: [
        [
          'es2015',
          {
            modules: false,
          },
        ],
      ],
      plugins: ['external-helpers'],
    }),
    nodeResolve({
      jsnext: true,
    }),
    uglify(),
  ],
};

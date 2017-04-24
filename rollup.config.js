const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

const defaultOptions = {
  entry: 'src/index.js',
  plugins: [
    babel({
      babelrc: false,
      presets: [
        ['es2015', {
          modules: false,
        }],
        'stage-0',
      ],
      plugins: [
        'external-helpers'
      ],
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
  ],
};

const commonjsOptions = Object.assign(
  {},
  defaultOptions,
  { external: 'deep-diff' }
);

rollup(defaultOptions)
  .then((bundle) => {
    bundle.write({
      format: 'umd',
      exports: 'named',
      moduleName: 'reduxLogger',
      dest: 'dist/index.umd.js',
    });
  });

rollup(commonjsOptions)
  .then((bundle) => {
    bundle.write({
      format: 'cjs',
      exports: 'named',
      dest: 'dist/index.cjs.js',
    });
  });

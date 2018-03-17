const tsc = require('typescript');

const tsconfig = require('../tsconfig.json');

const compilerOptions = Object.assign({}, tsconfig.compilerOptions, {
  module: 'commonjs',
});

module.exports = {
  process(source, path) {
    return (
      path.endsWith('.ts') || path.endsWith('.js')
        ? tsc.transpile(source, compilerOptions, path, [])
        : source
    );
  },
};
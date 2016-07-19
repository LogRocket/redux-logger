// Ensure object with toJSON method is converted to plain object. Useful for
// Immutable.js. https://github.com/evgenyrodionov/redux-logger/issues/161
const ensurePlainObject = object => JSON.parse(JSON.stringify(object));

export default {
  level: `log`,
  logger: console,
  logErrors: true,
  collapsed: undefined,
  predicate: undefined,
  duration: false,
  timestamp: true,
  stateTransformer: state => ensurePlainObject(state),
  actionTransformer: action => ensurePlainObject(action),
  errorTransformer: error => ensurePlainObject(error),
  colors: {
    title: () => `#000000`,
    prevState: () => `#9E9E9E`,
    action: () => `#03A9F4`,
    nextState: () => `#4CAF50`,
    error: () => `#F20404`,
  },
  diff: false,
  diffPredicate: undefined,

  // Deprecated options
  transformer: undefined,
};

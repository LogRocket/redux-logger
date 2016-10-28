export default {
  level: `log`,
  logger: (this && this.console) || (window && window.console),
  logErrors: true,
  collapsed: undefined,
  predicate: undefined,
  duration: false,
  timestamp: true,
  stateTransformer: state => state,
  actionTransformer: action => action,
  errorTransformer: error => error,
  colors: {
    title: () => `inherit`,
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

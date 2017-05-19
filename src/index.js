import printBuffer from './core';
import { timer } from './helpers';
import defaults from './defaults';
/* eslint max-len: ["error", 110, { "ignoreComments": true }] */
/**
 * Creates logger with following options
 *
 * @namespace
 * @param {object} options - options for logger
 * @param {string | function | object} options.level - console[level]
 * @param {boolean} options.duration - print duration of each action?
 * @param {boolean} options.timestamp - print timestamp with each action?
 * @param {object} options.colors - custom colors
 * @param {object} options.logger - implementation of the `console` API
 * @param {boolean} options.logErrors - should errors in action execution be caught, logged, and re-thrown?
 * @param {boolean} options.collapsed - is group collapsed?
 * @param {boolean} options.predicate - condition which resolves logger behavior
 * @param {function} options.stateTransformer - transform state before print
 * @param {function} options.actionTransformer - transform action before print
 * @param {function} options.errorTransformer - transform error before print
 *
 * @returns {function} logger middleware
 */
function directlyApplied(options) {
  return !!(options.getState && options.dispatch);
}

function hasLogger(options) {
  return options.logger;
}

function shouldNotLog({ predicate }, getState, action) {
  return !!(typeof predicate === 'function' && !predicate(getState, action));
}

function shouldDiff({ diff, diffPredicate }, getState, action) {
  return !!(diff && typeof diffPredicate === 'function' && diffPredicate(getState, action));
}

function emptyLogger() {
  return () => next => action => next(action);
}

function emptyLoggerWarning() {
  // eslint-disable-next-line no-console
  console.error(`[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:
// Logger with default options
import { logger } from 'redux-logger'
const store = createStore(
  reducer,
  applyMiddleware(logger)
)
// Or you can create your own logger with custom options http://bit.ly/redux-logger-options
import createLogger from 'redux-logger'
const logger = createLogger({
  // ...options
});
const store = createStore(
  reducer,
  applyMiddleware(logger)
)
`);
}

function createLogger(options = {}) {
  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (directlyApplied(options)) {
    emptyLoggerWarning();
    return emptyLogger();
  }

  const loggerOptions = Object.assign({}, defaults, options);

  // Return if 'console' object is not defined
  if (!hasLogger(loggerOptions)) return emptyLogger();

  return ({ getState }) => next => (action) => {
    // Exit early if predicate function returns 'false'
    if (shouldNotLog(options, getState, action)) return next(action);

    const started = timer.now();
    const startedTime = new Date();
    const prevState = loggerOptions.stateTransformer(getState());
    let returnedValue;
    let error;

    try {
      returnedValue = next(action);
    } catch (e) {
      if (loggerOptions.logErrors) {
        error = loggerOptions.errorTransformer(e);
      } else {
        throw e;
      }
    }

    const took = timer.now() - started;
    const nextState = loggerOptions.stateTransformer(getState());

    loggerOptions.diff = shouldDiff(loggerOptions, getState, action);

    printBuffer(
      [{
        started,
        startedTime,
        prevState,
        action,
        error,
        took,
        nextState,
      }],
      loggerOptions);

    if (error) throw error;
    return returnedValue;
  };
}

// eslint-disable-next-line consistent-return
const defaultLogger = ({ dispatch, getState } = {}) => {
  if (typeof dispatch === 'function' || typeof getState === 'function') {
    return createLogger()({ dispatch, getState });
  }
  // eslint-disable-next-line no-console
  console.error(`
[redux-logger v3] BREAKING CHANGE
[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.
[redux-logger v3] Change
[redux-logger v3] import createLogger from 'redux-logger'
[redux-logger v3] to
[redux-logger v3] import { createLogger } from 'redux-logger'
`);
};

export { defaults, createLogger, defaultLogger as logger };

export default defaultLogger;

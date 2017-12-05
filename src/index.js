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
function createLogger(options = {}) {
  const loggerOptions = Object.assign({}, defaults, options);

  const {
    logger,
    stateTransformer,
    errorTransformer,
    predicate,
    diffPredicate, // TODO: where description?
  } = loggerOptions;

  // Return if 'console' object is not defined
  if (typeof logger === 'undefined') {
    return () => next => action => next(action);
  }

  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (options.getState && options.dispatch) {
    // eslint-disable-next-line no-console
    console.error(`[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:
// Logger with default options
import { logger } from 'redux-logger'
const store = createStore(
  reducer,
  applyMiddleware(logger)
)
// Or you can create your own logger with custom options http://bit.ly/redux-logger-options
import { createLogger } from 'redux-logger'
const logger = createLogger({
  // ...options
});
const store = createStore(
  reducer,
  applyMiddleware(logger)
)
`);

    return mainReducer => (state, action) => mainReducer(state, action);
  }

  const logBuffer = [];

  return mainReducer => (state, action) => {
    // Exit early if predicate function returns 'false'
    if (typeof predicate === 'function' && !predicate(state, action)) {
      return mainReducer(state, action);
    }

    const logEntry = {};

    logBuffer.push(logEntry);

    logEntry.started = timer.now();
    logEntry.startedTime = new Date();
    logEntry.prevState = stateTransformer(state);
    logEntry.action = action;

    // TODO: make logErrors always true?
    try {
      logEntry.nextState = mainReducer(state, action);
    } catch (e) {
      logEntry.error = errorTransformer(e);
    }

    logEntry.took = timer.now() - logEntry.started;

    const diff = loggerOptions.diff && typeof diffPredicate === 'function'
      ? diffPredicate(state, action)
      : loggerOptions.diff;

    printBuffer(logBuffer, Object.assign({}, loggerOptions, { diff }));
    logBuffer.length = 0;

    if (logEntry.error) throw logEntry.error;
    return logEntry.nextState;
  };
}

// eslint-disable-next-line consistent-return
const defaultLogger = mainReducer => createLogger()(mainReducer);

export { defaults, createLogger, defaultLogger as logger };

export default defaultLogger;

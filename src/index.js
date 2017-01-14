import { printBuffer } from './core';
import { timer } from './helpers';
import defaults from './defaults';
import createDebouncedPersister from './persistence';

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
 * @param {function} options.persister - takes an array of log objects, returns a Promise that is resolved when items are persisted
 * @param {function} options.persistencePredicate - determines if logs should be persisted
 * @param {number} options.persistenceDelay - debounce milliseconds
 * @returns {function} logger middleware
 */
function createLogger(options = {}) {
  const loggerOptions = {
    ...defaults,
    ...options,
  };

  const {
    logger,
    transformer, stateTransformer, errorTransformer,
    predicate, logErrors,
    diffPredicate,
    persister,
    persistencePredicate,
    persistenceDelay,
  } = loggerOptions;

  // Return if 'console' object is not defined
  if (typeof logger === `undefined`) {
    return () => next => action => next(action);
  }

  if (transformer) {
    console.error(`Option 'transformer' is deprecated, use 'stateTransformer' instead!`); // eslint-disable-line no-console
  }

  let persistBuffer;
  if (persister) {
    persistBuffer = createDebouncedPersister({ persistenceDelay });
  }

  const logBuffer = [];
  const asyncLogBuffer = [];

  return ({ getState }) => (next) => (action) => {
    // Exit early if predicate function returns 'false'
    if (typeof predicate === `function` && !predicate(getState, action)) {
      return next(action);
    }

    const logEntry = {};
    logBuffer.push(logEntry);
    asyncLogBuffer.push(logEntry);

    logEntry.started = timer.now();
    logEntry.startedTime = new Date();
    logEntry.prevState = stateTransformer(getState());
    logEntry.action = action;

    let returnedValue;
    if (logErrors) {
      try {
        returnedValue = next(action);
      } catch (e) {
        logEntry.error = errorTransformer(e);
      }
    } else {
      returnedValue = next(action);
    }

    logEntry.took = timer.now() - logEntry.started;
    logEntry.nextState = stateTransformer(getState());

    const diff = loggerOptions.diff && typeof diffPredicate === `function` ? diffPredicate(getState, action) : loggerOptions.diff;

    if (persistBuffer) {
      if (typeof persistencePredicate !== `function` || persistencePredicate(getState, action)) {
        persistBuffer(asyncLogBuffer, { ...loggerOptions, diff });
      }
    }

    printBuffer(logBuffer, { ...loggerOptions, diff });
    logBuffer.length = 0;

    if (logEntry.error) throw logEntry.error;
    return returnedValue;
  };
}

export default createLogger;

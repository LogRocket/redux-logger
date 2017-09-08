export const repeat = (str, times) => (new Array(times + 1)).join(str);

export const pad = (num, maxLength) => repeat('0', maxLength - num.toString().length) + num;

export const formatTime = time => `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;

// Use performance API if it's available in order to get better precision
export const timer =
  (typeof performance !== 'undefined' && performance !== null) && typeof performance.now === 'function' ?
    performance :
    Date;

export const directlyApplied = ({ getState, dispatch }) => !!(getState && dispatch);

export const hasLogger = ({ logger }) => logger;

export const shouldNotLog = ({ predicate }, getState, action) =>
  (typeof predicate === 'function' && !predicate(getState, action));

export const shouldDiff = ({ diff, diffPredicate }, getState, action) =>
  !!(diff && typeof diffPredicate === 'function' && diffPredicate(getState, action));

export const emptyLogger = () => () => next => action => next(action);

export function emptyLoggerWarning() {
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

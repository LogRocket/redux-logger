const pad = num => ('0' + num).slice(-2);

// Use the new performance api to get better precision if available
const timer = typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance : Date;

/**
 * Creates logger with followed options
 *
 * @namespace
 * @property {object} options - options for logger
 * @property {string} level - console[level]
 * @property {boolean} collapsed - is group collapsed?
 * @property {boolean} predicate - condition which resolves logger behavior
 */

function createLogger(options = {}) {
  return ({ getState }) => (next) => (action) => {
    const { level, collapsed, predicate, logger, transformer = state => state, timestamp = true, duration = false } = options;
    const console = logger || window.console;

    // exit if console undefined
    if (typeof console === 'undefined') {
      return next(action);
    }

    // exit early if predicate function returns false
    if (typeof predicate === 'function' && !predicate(getState, action)) {
      return next(action);
    }

    const prevState = transformer(getState());
    const started = timer.now();
    const returnValue = next(action);
    const took = timer.now() - started;
    const nextState = transformer(getState());
    let formattedTime = '';
    if (timestamp) {
      const time = new Date();
      formattedTime = ` @ ${time.getHours()}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
    }
    let formattedDuration = '';
    if (duration) {
      formattedDuration = ` in ${took.toFixed(2)} ms`;
    }
    const actionType = String(action.type);
    const message = `action ${actionType}${formattedTime}${formattedDuration}`;

    const isCollapsed = (typeof collapsed === 'function') ?
      collapsed(getState, action) :
      collapsed;

    if (isCollapsed) {
      try {
        console.groupCollapsed(message);
      } catch (e) {
        console.log(message);
      }
    } else {
      try {
        console.group(message);
      } catch (e) {
        console.log(message);
      }
    }

    if (level) {
      console[level](`%c prev state`, `color: #9E9E9E; font-weight: bold`, prevState);
      console[level](`%c action`, `color: #03A9F4; font-weight: bold`, action);
      console[level](`%c next state`, `color: #4CAF50; font-weight: bold`, nextState);
    } else {
      console.log(`%c prev state`, `color: #9E9E9E; font-weight: bold`, prevState);
      console.log(`%c action`, `color: #03A9F4; font-weight: bold`, action);
      console.log(`%c next state`, `color: #4CAF50; font-weight: bold`, nextState);
    }

    try {
      console.groupEnd();
    } catch (e) {
      console.log('—— log end ——');
    }

    return returnValue;
  };
}

export default createLogger;

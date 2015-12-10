const repeat = (str, times) => (new Array(times + 1)).join(str);
const pad = (num, maxLength) => repeat(`0`, maxLength - num.toString().length) + num;
const formatTime = (time) => ` @ ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;

// Use the new performance api to get better precision if available
const timer = typeof performance !== `undefined` && typeof performance.now === `function` ? performance : Date;

/**
 * Creates logger with followed options
 *
 * @namespace
 * @property {object} options - options for logger
 * @property {string} options.level - console[level]
 * @property {bool} options.duration - print duration of each action?
 * @property {bool} options.timestamp - print timestamp with each action?
 * @property {object} options.colors - custom colors
 * @property {object} options.logger - implementation of the `console` API
 * @property {boolean} options.collapsed - is group collapsed?
 * @property {boolean} options.predicate - condition which resolves logger behavior
 * @property {function} options.stateTransformer - transform state before print
 * @property {function} options.actionTransformer - transform action before print
 */

function createLogger(options = {}) {
  return ({ getState }) => (next) => (action) => {
    const {
      level = `log`,
      logger = window.console,
      collapsed,
      predicate,
      duration = false,
      timestamp = true,
      transformer, // deprecated
      stateTransformer = state => state,
      actionTransformer = actn => actn,
      colors = {
        title: () => `#000000`,
        prevState: () => `#9E9E9E`,
        action: () => `#03A9F4`,
        nextState: () => `#4CAF50`,
      },
    } = options;

    // exit if console undefined
    if (typeof logger === `undefined`) {
      return next(action);
    }

    // exit early if predicate function returns false
    if (typeof predicate === `function` && !predicate(getState, action)) {
      return next(action);
    }

    if (transformer) {
      console.error(`Option 'transformer' is deprecated, use stateTransformer instead`);
    }

    const started = timer.now();
    const prevState = stateTransformer(getState());

    const formattedAction = actionTransformer(action);
    const returnedValue = next(action);

    const took = timer.now() - started;
    const nextState = stateTransformer(getState());

    // message
    const time = new Date();
    const isCollapsed = (typeof collapsed === `function`) ? collapsed(getState, action) : collapsed;

    const formattedTime = formatTime(time);
    const titleCSS = colors.title ? `color: ${colors.title(formattedAction)};` : null;
    const title = `action ${formattedAction.type}${timestamp ? formattedTime : ``}${duration ? ` in ${took.toFixed(2)} ms` : ``}`;

    // render
    try {
      if (isCollapsed) {
        if (colors.title) logger.groupCollapsed(`%c ${title}`, titleCSS);
        else logger.groupCollapsed(title);
      } else {
        if (colors.title) logger.group(`%c ${title}`, titleCSS);
        else logger.group(title);
      }
    } catch (e) {
      logger.log(title);
    }

    if (colors.prevState) logger[level](`%c prev state`, `color: ${colors.prevState(prevState)}; font-weight: bold`, prevState);
    else logger[level](`prev state`, prevState);

    if (colors.action) logger[level](`%c action`, `color: ${colors.action(formattedAction)}; font-weight: bold`, formattedAction);
    else logger[level](`action`, formattedAction);

    if (colors.nextState) logger[level](`%c next state`, `color: ${colors.nextState(nextState)}; font-weight: bold`, nextState);
    else logger[level](`next state`, nextState);

    try {
      logger.groupEnd();
    } catch (e) {
      logger.log(`—— log end ——`);
    }

    return returnedValue;
  };
}

export default createLogger;

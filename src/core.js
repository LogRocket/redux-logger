import { formatTime } from './helpers';
import diffLogger from './diff';

/**
 * Get log level string based on supplied params
 *
 * @param {string | function | object} level - console[level]
 * @param {object} action - selected action
 * @param {array} payload - selected payload
 * @param {string} type - log entry type
 *
 * @returns {string} level
 */
function getLogLevel(level, action, payload, type) {
  switch (typeof level) {
    case `object`:
      return typeof level[type] === `function` ? level[type](...payload) : level[type];
    case `function`:
      return level(action);
    default:
      return level;
  }
}

function defaultTitleFormatter(options) {
  const {
    timestamp, duration,
  } = options;

  return (action, time, took) => {
    const parts = [`action`];
    if (timestamp) {
      parts.push(`@ ${time}`);
    }
    parts.push(action.type);
    if (duration) {
      parts.push(`(in ${took.toFixed(2)} ms)`);
    }
    return parts.join(` `);
  };
}

export function printBuffer(buffer, options) {
  const {
    logger,
    actionTransformer,
    titleFormatter = defaultTitleFormatter(options),
    collapsed, colors, level, diff,
  } = options;

  buffer.forEach((logEntry, key) => {
    const { started, startedTime, action, prevState, error } = logEntry;
    let { took, nextState } = logEntry;
    const nextEntry = buffer[key + 1];

    if (nextEntry) {
      nextState = nextEntry.prevState;
      took = nextEntry.started - started;
    }

    // Message
    const formattedAction = actionTransformer(action);
    const isCollapsed = (typeof collapsed === `function`) ? collapsed(() => nextState, action) : collapsed;

    const formattedTime = formatTime(startedTime);
    const titleCSS = colors.title ? `color: ${colors.title(formattedAction)};` : null;
    const title = titleFormatter(formattedAction, formattedTime, took);

    // Render
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

    const prevStateLevel = getLogLevel(level, formattedAction, [prevState], `prevState`);
    const actionLevel = getLogLevel(level, formattedAction, [formattedAction], `action`);
    const errorLevel = getLogLevel(level, formattedAction, [error, prevState], `error`);
    const nextStateLevel = getLogLevel(level, formattedAction, [nextState], `nextState`);

    if (prevStateLevel) {
      if (colors.prevState) logger[prevStateLevel](`%c prev state`, `color: ${colors.prevState(prevState)}; font-weight: bold`, prevState);
      else logger[prevStateLevel](`prev state`, prevState);
    }

    if (actionLevel) {
      if (colors.action) logger[actionLevel](`%c action`, `color: ${colors.action(formattedAction)}; font-weight: bold`, formattedAction);
      else logger[actionLevel](`action`, formattedAction);
    }

    if (error && errorLevel) {
      if (colors.error) logger[errorLevel](`%c error`, `color: ${colors.error(error, prevState)}; font-weight: bold`, error);
      else logger[errorLevel](`error`, error);
    }

    if (nextStateLevel) {
      if (colors.nextState) logger[nextStateLevel](`%c next state`, `color: ${colors.nextState(nextState)}; font-weight: bold`, nextState);
      else logger[nextStateLevel](`next state`, nextState);
    }

    if (diff) {
      diffLogger(prevState, nextState, logger, isCollapsed);
    }

    try {
      logger.groupEnd();
    } catch (e) {
      logger.log(`—— log end ——`);
    }
  });
}

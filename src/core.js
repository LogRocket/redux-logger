import diffLogger from './diff';
import { formatTime } from './helpers';

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
const getLogLevel = (level, action, payload, type) => {
  switch (typeof level) {
    case 'object':
      return typeof level[type] === 'function' ? level[type](...payload) : level[type];
    case 'function':
      return level(action);
    default:
      return level;
  }
};
/**
 * Title Formatter Function
 * returns a formatter function that takes in action ,time and took
 * @param timestamp
 * @param duration
 * @returns {func} Takes in params action,time,took
 */
const defaultTitleFormatter = ({ timestamp, duration }) => (action, time, took) => {
  const parts = ['action'];
  parts.push(`%c${String(action.type)}`);
  if (timestamp) parts.push(`%c@ ${time}`);
  if (duration) parts.push(`%c(in ${took.toFixed(2)} ms)`);
  return parts.join(' ');
};

/**
 *
 * @param {array} buffer
 * @param logger
 * @param actionTransformer
 * @param timestamp
 * @param duration
 * @param collapsed
 * @param colors
 * @param level
 * @param diff
 */
export default (buffer, {
  logger, actionTransformer,
  timestamp, duration, collapsed, colors, level, diff,
}) => {
  const titleFormatter = defaultTitleFormatter({ timestamp, duration });
  const isUsingDefaultFormatter = typeof titleFormatter === 'undefined';

  buffer.forEach((logEntry, key) => {
    const {
      started, startedTime, action, prevState, error,
    } = logEntry;
    let { took, nextState } = logEntry;
    const nextEntry = buffer[key + 1];
    if (nextEntry) {
      nextState = nextEntry.prevState;
      took = nextEntry.started - started;
    }
    // Message
    const formattedAction = actionTransformer(action);
    const isCollapsed = typeof collapsed === 'function'
      ? collapsed(() => nextState, action, logEntry)
      : collapsed;

    const formattedTime = formatTime(startedTime);
    const titleCSS = colors.title ? `color: ${colors.title(formattedAction)};` : '';
    const headerCSS = ['color: gray; font-weight: lighter;'];
    headerCSS.push(titleCSS);
    if (timestamp) headerCSS.push('color: gray; font-weight: lighter;');
    if (duration) headerCSS.push('color: gray; font-weight: lighter;');
    const title = titleFormatter(formattedAction, formattedTime, took);

    // Render
    try {
      if (isCollapsed) {
        if (colors.title && isUsingDefaultFormatter) {
          logger.groupCollapsed(`%c ${title}`, ...headerCSS);
        } else logger.groupCollapsed(title);
      } else if (colors.title && isUsingDefaultFormatter) {
        logger.group(`%c ${title}`, ...headerCSS);
      } else {
        logger.group(title);
      }
    } catch (e) {
      logger.log(title);
    }

    const prevStateLevel = getLogLevel(level, formattedAction, [prevState], 'prevState');
    const actionLevel = getLogLevel(level, formattedAction, [formattedAction], 'action');
    const errorLevel = getLogLevel(level, formattedAction, [error, prevState], 'error');
    const nextStateLevel = getLogLevel(level, formattedAction, [nextState], 'nextState');

    if (prevStateLevel) {
      if (colors.prevState) {
        const styles = `color: ${colors.prevState(prevState)}; font-weight: bold`;
        logger[prevStateLevel]('%c prev state', styles, prevState);
      } else logger[prevStateLevel]('prev state', prevState);
    }

    if (actionLevel) {
      if (colors.action) {
        const styles = `color: ${colors.action(formattedAction)}; font-weight: bold`;

        logger[actionLevel]('%c action    ', styles, formattedAction);
      } else logger[actionLevel]('action    ', formattedAction);
    }

    if (error && errorLevel) {
      if (colors.error) {
        const styles = `color: ${colors.error(error, prevState)}; font-weight: bold;`;

        logger[errorLevel]('%c error     ', styles, error);
      } else logger[errorLevel]('error     ', error);
    }

    if (nextStateLevel) {
      if (colors.nextState) {
        const styles = `color: ${colors.nextState(nextState)}; font-weight: bold`;

        logger[nextStateLevel]('%c next state', styles, nextState);
      } else logger[nextStateLevel]('next state', nextState);
    }

    if (logger.withTrace) {
      logger.groupCollapsed('TRACE');
      logger.trace();
      logger.groupEnd();
    }

    if (diff) {
      diffLogger(prevState, nextState, logger, isCollapsed);
    }

    try {
      logger.groupEnd();
    } catch (e) {
      logger.log('—— log end ——');
    }
  });
};

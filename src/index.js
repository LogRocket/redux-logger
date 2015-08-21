import createLogger from './createLogger';
import logger from './logger';

function resolver(input) {
  if (input) {
    const { dispatch } = input;

    if (dispatch) {
      console.warn('redux-logger updated to 1.0.0 and old `logger` is deprecated, check out https://github.com/fcomb/redux-logger/releases/tag/1.0.0');
      return logger(input);
    } else {
      return createLogger(input);
    }
  } else {
    return createLogger();
  }
}

export default resolver;

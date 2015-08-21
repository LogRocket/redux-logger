'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createLogger = require('./createLogger');

var _createLogger2 = _interopRequireDefault(_createLogger);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function resolver(input) {
  if (input) {
    var dispatch = input.dispatch;

    if (dispatch) {
      console.warn('redux-logger updated to 1.0.0 and old `logger` is deprecated, check out https://github.com/fcomb/redux-logger/releases/tag/1.0.0');
      return (0, _logger2['default'])(input);
    } else {
      return (0, _createLogger2['default'])(input);
    }
  } else {
    return (0, _createLogger2['default'])();
  }
}

exports['default'] = resolver;
module.exports = exports['default'];
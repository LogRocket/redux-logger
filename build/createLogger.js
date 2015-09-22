'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var pad = function pad(num) {
  return ('0' + num).slice(-2);
};

// Use the new performance api to get better precision if available
var timer = typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance : Date;

/**
 * Creates logger with followed options
 *
 * @namespace
 * @property {object} options - options for logger
 * @property {string} level - console[level]
 * @property {boolean} collapsed - is group collapsed?
 * @property {boolean} predicate - condition which resolves logger behavior
 */

function createLogger() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return function (_ref) {
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        var level = options.level;
        var collapsed = options.collapsed;
        var predicate = options.predicate;
        var logger = options.logger;
        var _options$transformer = options.transformer;
        var transformer = _options$transformer === undefined ? function (state) {
          return state;
        } : _options$transformer;
        var _options$timestamp = options.timestamp;
        var timestamp = _options$timestamp === undefined ? true : _options$timestamp;
        var _options$duration = options.duration;
        var duration = _options$duration === undefined ? false : _options$duration;

        var console = logger || window.console;

        // exit if console undefined
        if (typeof console === 'undefined') {
          return next(action);
        }

        // exit early if predicate function returns false
        if (typeof predicate === 'function' && !predicate(getState, action)) {
          return next(action);
        }

        var prevState = transformer(getState());
        var started = timer.now();
        var returnValue = next(action);
        var took = timer.now() - started;
        var nextState = transformer(getState());
        var formattedTime = '';
        if (timestamp) {
          var time = new Date();
          formattedTime = ' @ ' + time.getHours() + ':' + pad(time.getMinutes()) + ':' + pad(time.getSeconds());
        }
        var formattedDuration = '';
        if (duration) {
          formattedDuration = ' in ' + took.toFixed(2) + ' ms';
        }
        var actionType = String(action.type);
        var message = 'action ' + actionType + formattedTime + formattedDuration;

        var isCollapsed = typeof collapsed === 'function' ? collapsed(getState, action) : collapsed;

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
          console[level]('%c prev state', 'color: #9E9E9E; font-weight: bold', prevState);
          console[level]('%c action', 'color: #03A9F4; font-weight: bold', action);
          console[level]('%c next state', 'color: #4CAF50; font-weight: bold', nextState);
        } else {
          console.log('%c prev state', 'color: #9E9E9E; font-weight: bold', prevState);
          console.log('%c action', 'color: #03A9F4; font-weight: bold', action);
          console.log('%c next state', 'color: #4CAF50; font-weight: bold', nextState);
        }

        try {
          console.groupEnd();
        } catch (e) {
          console.log('—— log end ——');
        }

        return returnValue;
      };
    };
  };
}

exports['default'] = createLogger;
module.exports = exports['default'];
/**
 * Creates logger with followed options
 *
 * @namespace
 * @propety {object} options - options for logger
 * @property {string} level - console[level]
 * @propety {boolean} collapsed - is group collapsed?
 * @property {bool} predicate - condition which resolves logger behavior
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
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

        var console = logger || window.console;

        // exit if console undefined
        if (typeof console === 'undefined') {
          return next(action);
        }

        // exit early if predicate function returns false
        if (typeof predicate === 'function' && !predicate(getState, action)) {
          return next(action);
        }

        var prevState = getState();
        var returnValue = next(action);
        var nextState = getState();
        var time = new Date();
        var actionType = String(action.type);
        var message = 'action ' + actionType + ' @ ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();

        if (collapsed) {
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
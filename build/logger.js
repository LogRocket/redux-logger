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
        if (typeof console === 'undefined') {
          return next(action);
        }

        // exit early if predicate function returns false
        if (typeof options.predicate === 'function' && !options.predicate(getState, action)) {
          return next(action);
        }

        var prevState = getState();
        var returnValue = next(action);
        var nextState = getState();
        var time = new Date();
        var message = 'action ' + action.type + ' @ ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();

        try {
          console.group(message);
        } catch (e) {
          console.log('NOT GROUP');
        }

        console.log('%c prev state', 'color: #9E9E9E; font-weight: bold', prevState);
        console.log('%c action', 'color: #03A9F4; font-weight: bold', action);
        console.log('%c next state', 'color: #4CAF50; font-weight: bold', nextState);

        try {
          console.groupEnd('—— log end ——');
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
// https://github.com/flitbit/diff#differences
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _deepDiff = require('deep-diff');

var _deepDiff2 = _interopRequireDefault(_deepDiff);

var dictionary = {
  E: 'CHANGED:',
  N: 'ADDED:',
  D: 'DELETED'
};

function logger(_ref) {
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      var prevState = getState();
      var returnValue = next(action);
      var newState = getState();
      var time = new Date();

      var diff = (0, _deepDiff2['default'])(prevState, newState);

      console.group('diff @ ', time.getMinutes() + ':' + time.getSeconds());

      diff.forEach(function (elem) {
        var kind = elem.kind;
        var path = elem.path;
        var lhs = elem.lhs;
        var rhs = elem.rhs;

        console.info(dictionary[kind], path.join('.'), lhs, ' → ', rhs);
      });

      console.groupEnd('diff');

      return returnValue;
    };
  };
}

exports['default'] = logger;
module.exports = exports['default'];
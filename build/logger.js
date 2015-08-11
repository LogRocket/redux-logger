// https://github.com/flitbit/diff#differences
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _deepDiff = require('deep-diff');

var _deepDiff2 = _interopRequireDefault(_deepDiff);

var dictionary = {
  E: {
    color: '#2196F3',
    text: 'CHANGED:'
  },
  N: {
    color: '#4CAF50',
    text: 'ADDED:'
  },
  D: {
    color: '#F44336',
    text: 'DELETED:'
  },
  A: {
    color: '#2196F3',
    text: 'ARRAY:'
  }
};

function style(kind) {
  return 'color: ' + dictionary[kind].color + '; font-weight: bold';
}

function render(diff) {
  var kind = diff.kind;
  var path = diff.path;
  var lhs = diff.lhs;
  var rhs = diff.rhs;
  var index = diff.index;
  var item = diff.item;

  switch (kind) {
    case 'E':
      return path.join('.') + ' ' + lhs + ' → ' + rhs;
    case 'N':
      return path.join('.') + ' ' + rhs;
    case 'D':
      return '' + path.join('.');
    case 'A':
      return (path.join('.') + '[' + index + ']', item);
    default:
      return null;
  }
}

function logger(_ref) {
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      var prevState = getState();
      var returnValue = next(action);
      var newState = getState();
      var time = new Date();

      var diff = (0, _deepDiff2['default'])(prevState, newState);

      if (diff) {
        console.group('diff @', time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());

        diff.forEach(function (elem) {
          var kind = elem.kind;

          var output = render(elem);

          console.log('%c ' + dictionary[kind].text, style(kind), output);
        });

        console.groupEnd('diff');
      }

      return returnValue;
    };
  };
}

exports['default'] = logger;
module.exports = exports['default'];
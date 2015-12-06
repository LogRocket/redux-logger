"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var repeat = function repeat(str, times) {
  return new Array(times + 1).join(str);
};
var pad = function pad(num, maxLength) {
  return repeat("0", maxLength - num.toString().length) + num;
};
var formatTime = function formatTime(time) {
  return " @ " + pad(time.getHours(), 2) + ":" + pad(time.getMinutes(), 2) + ":" + pad(time.getSeconds(), 2) + "." + pad(time.getMilliseconds(), 3);
};

// Use the new performance api to get better precision if available
var timer = typeof performance !== "undefined" && typeof performance.now === "function" ? performance : Date;

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

function createLogger() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return function (_ref) {
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        var _options$level = options.level;
        var level = _options$level === undefined ? "log" : _options$level;
        var _options$logger = options.logger;
        var logger = _options$logger === undefined ? window.console : _options$logger;
        var collapsed = options.collapsed;
        var predicate = options.predicate;
        var _options$duration = options.duration;
        var duration = _options$duration === undefined ? false : _options$duration;
        var _options$timestamp = options.timestamp;
        var timestamp = _options$timestamp === undefined ? true : _options$timestamp;
        var transformer = options.transformer;
        var _options$stateTransfo = options.stateTransformer;
        var // deprecated
        stateTransformer = _options$stateTransfo === undefined ? function (state) {
          return state;
        } : _options$stateTransfo;
        var _options$actionTransf = options.actionTransformer;
        var actionTransformer = _options$actionTransf === undefined ? function (actn) {
          return actn;
        } : _options$actionTransf;
        var _options$colors = options.colors;
        var colors = _options$colors === undefined ? {
          prevState: function prevState() {
            return "#9E9E9E";
          },
          action: function action() {
            return "#03A9F4";
          },
          nextState: function nextState() {
            return "#4CAF50";
          }
        } : _options$colors;

        // exit if console undefined

        if (typeof logger === "undefined") {
          return next(action);
        }

        // exit early if predicate function returns false
        if (typeof predicate === "function" && !predicate(getState, action)) {
          return next(action);
        }

        if (transformer) {
          console.error("Option 'transformer' is deprecated, use stateTransformer instead");
        }

        var started = timer.now();
        var prevState = stateTransformer(getState());

        var formattedAction = actionTransformer(action);

        var took = timer.now() - started;
        var nextState = stateTransformer(getState());

        // message
        var time = new Date();
        var isCollapsed = typeof collapsed === "function" ? collapsed(getState, action) : collapsed;

        var formattedTime = formatTime(time);
        var title = "action " + formattedAction.type + (timestamp && formattedTime) + (duration && " in " + took.toFixed(2) + " ms");

        // render
        try {
          if (isCollapsed) {
            logger.groupCollapsed(title);
          } else {
            logger.group(title);
          }
        } catch (e) {
          logger.log(title);
        }

        if (colors) {
          logger[level]("%c prev state", "color: " + colors.prevState(prevState) + "; font-weight: bold", prevState);
          logger[level]("%c action", "color: " + colors.action(formattedAction) + "; font-weight: bold", formattedAction);
          logger[level]("%c next state", "color: " + colors.nextState(nextState) + "; font-weight: bold", nextState);
        } else {
          logger[level]("prev state", prevState);
          logger[level]("action", formattedAction);
          logger[level]("next state", nextState);
        }

        try {
          logger.groupEnd();
        } catch (e) {
          logger.log("—— log end ——");
        }

        return next(action);
      };
    };
  };
}

exports.default = createLogger;
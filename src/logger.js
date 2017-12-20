/*
 * Browser support detection heavily borrowed from:
 * https://github.com/evgenyrodionov/redux-logger/issues/170#issuecomment-240717892
 */

const isNode = typeof exports === 'object' && typeof module !== 'undefined';

const browser = {
  isNode,
  isFirefox: !isNode && /firefox/i.test(navigator.userAgent),
  isEdge: !isNode && /\bEdge\b/.test(navigator.userAgent),
  isIE: !isNode && !!document.documentMode,
  isChrome: !isNode && !!window.chrome,
  isSafari: !isNode && !!window.safari,
};

const support = {
  consoleStyles: !(isNode || browser.isIE || browser.isEdge),
  consoleGroupStyles: browser.isChrome || browser.isSafari,
};

/**
 * Proxies all console calls; if we don't have colors will strip out colors and
 * next param(s) that define color information.
 * @param {boolean} hasSupport whether we have color support
 * @param {*[]} args arguments passed to console method
 * @returns {*[]} array of (potentially truncated) arguments to pass back to console method
 */
function truncateColorArguments(hasSupport, ...args) {
  if (hasSupport) { return args; }

  const hasColorString = /%c/gi;

  return args.reduce((memo, item, index, array) => {
    // if {index} is a string and include %c, remove %c from the string.
    // also remove any subsequent params (this would be color information)
    if (typeof item === 'string' && hasColorString.test(item)) {
      array.splice(index + 1, item.split(hasColorString).length - 1);
      memo.push(item.replace(hasColorString, ''));
    } else {
      memo.push(item);
    }
    return memo;
  }, []);
}

export function log(...args) {
  console.log(...truncateColorArguments(support.consoleStyles, ...args));
}

export function group(...args) {
  console.group(...truncateColorArguments(support.consoleGroupStyles, ...args));
}

export function groupCollapsed(...args) {
  console.groupCollapsed(...truncateColorArguments(support.consoleGroupStyles, ...args));
}

export function groupEnd() {
  try {
    console.groupEnd();
  } catch (e) {
    log('—— log end ——');
  }
}

/*
 * Browser support detection heavily borrowed from:
 * https://github.com/evgenyrodionov/redux-logger/issues/170#issuecomment-240717892
 */
const browser = {
  isFirefox: /firefox/i.test(navigator.userAgent),
  isEdge: /\bEdge\b/.test(navigator.userAgent),
  isIE: !!document.documentMode,
  isChrome: !!window.chrome,
  isSafari: !!window.safari,
};

const support = {
  console: !!window.console,
  consoleStyles: !(browser.isIE || browser.isEdge),
  consoleGroupStyles: browser.isChrome || browser.isSafari,
};

/*
 * By default colors are applied at the beginning of groupings strings
 * This ensures that those are removed for browsers that do not support
 */
function truncateInitialColor(text) {
  if (text && text.substring(0, 3) === `%c `) {
    return text.substring(3);
  }

  return text;
}

export function log(text, css) {
  if (!support.console) return;
  if (css && support.consoleStyles) {
    console.log(text, css);
  } else {
    console.log(truncateInitialColor(text));
  }
}

export function group(text, css) {
  if (!support.console) return;
  if (css && support.consoleGroupStyles) {
    console.group(text, css);
  } else {
    console.group(truncateInitialColor(text));
  }
}

export function groupCollapsed(text, css) {
  if (!support.console) return;
  else if (css && support.consoleGroupStyles) {
    console.groupCollapsed(text, css);
  } else {
    console.groupCollapsed(truncateInitialColor(text));
  }
}

export function groupEnd() {
  if (!support.console) return;
  try {
    console.groupEnd();
  } catch (e) {
    log(`—— log end ——`);
  }
}

function createLogger(options = {}) {
  return ({ getState }) => (next) => (action) => {
    if (typeof console === 'undefined') {
      return next(action);
    }

    // exit early if predicate function returns false
    if (typeof options.predicate === 'function' && !options.predicate(getState, action)) {
      return next(action);
    }

    const prevState = getState();
    const returnValue = next(action);
    const nextState = getState();
    const time = new Date();
    const message = `action ${action.type} @ ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

    try {
      console.group(message);
    } catch(e) {
      console.log('NOT GROUP');
    }

    console.log(`%c prev state`, `color: #9E9E9E; font-weight: bold`, prevState);
    console.log(`%c action`, `color: #03A9F4; font-weight: bold`, action);
    console.log(`%c next state`, `color: #4CAF50; font-weight: bold`, nextState);

    try {
      console.groupEnd('—— log end ——');
    } catch(e) {
      console.log('—— log end ——');
    }

    return returnValue;
  };
}

export default createLogger;

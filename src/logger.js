/**
 * Deprecated, will be removed 1.1.0
 */

function logger({ getState }) {
  return (next) => (action) => {
    // exit if console undefined
    if (typeof console === 'undefined') {
      return next(action);
    }

    const prevState = getState();
    const returnValue = next(action);
    const nextState = getState();
    const time = new Date();
    const message = `action ${action.type} @ ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

    try {
      console.group(message);
    } catch (e) {
      console.log(message);
    }

    console.log(`%c prev state`, `color: #9E9E9E; font-weight: bold`, prevState);
    console.log(`%c action`, `color: #03A9F4; font-weight: bold`, action);
    console.log(`%c next state`, `color: #4CAF50; font-weight: bold`, nextState);

    try {
      console.groupEnd();
    } catch (e) {
      console.log('—— log end ——');
    }

    return returnValue;
  };
}

export default logger;

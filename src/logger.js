// https://github.com/flitbit/diff#differences
import differ from 'deep-diff';

const dictionary = {
  E: 'CHANGED:',
  N: 'ADDED:',
  D: 'DELETED',
};

function logger({ getState }) {
  return (next) => (action) => {
    const prevState = getState();
    const returnValue = next(action);
    const newState = getState();
    const time = new Date();

    const diff = differ(prevState, newState);

    if (diff) {
      console.group('diff @', `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);

      diff.forEach((elem) => {
        const { kind, path, lhs, rhs } = elem;
        console.info(dictionary[kind], path.join('.'), lhs, ' → ', rhs);
      });

      console.groupEnd('diff');
    }

    return returnValue;
  };
}

export default logger;

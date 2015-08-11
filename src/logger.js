// https://github.com/flitbit/diff#differences
import differ from 'deep-diff';

const dictionary = {
  E: {
    color: '#2196F3',
    text: 'CHANGED:',
  },
  N: {
    color: '#4CAF50',
    text: 'ADDED:',
  },
  D: {
    color: '#F44336',
    text: 'DELETED:',
  },
  A: {
    color: '#2196F3',
    text: 'ARRAY:',
  },
};

function style(kind) {
  return `color: ${dictionary[kind].color}; font-weight: bold`;
}

function render(diff) {
  const { kind, path, lhs, rhs, index, item } = diff;

  switch (kind) {
  case 'E':
    return `${path.join('.')} ${lhs} → ${rhs}`;
  case 'N':
    return `${path.join('.')} ${rhs}`;
  case 'D':
    return `${path.join('.')}`;
  case 'A':
    return (`${path.join('.')}[${index}]`, item);
  default:
    return null;
  }
}

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
        const { kind } = elem;
        const output = render(elem);

        console.log(`%c ${dictionary[kind].text}`, style(kind), output);
      });

      console.groupEnd('diff');
    }

    return returnValue;
  };
}

export default logger;

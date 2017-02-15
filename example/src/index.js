import 'normalize.css';
import 'styles/base';

import React from 'react';
import { render } from 'react-dom';
import createLogger from 'redux-logger';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import Example from 'components/example';
import reducers from 'reducers';
import { AUTH_REMOVE_TOKEN, AUTH_SET_INFO, AUTH_SET_TOKEN } from 'constants/auth';

localStorage.clear(`actions`);

const logPersister = (logQueue) => {
  let array = JSON.parse(localStorage.getItem(`actions`)) || [];
  array = array.concat(logQueue);
  localStorage.setItem(`actions`, JSON.stringify(array));

  return Promise.resolve();
};

const logger = createLogger({
  predicate: (getState, action) => action.type !== AUTH_REMOVE_TOKEN, // log all actions except AUTH_REMOVE_TOKEN
  level: {
    prevState: () => `info`,
    action: ({ type }) => type === AUTH_SET_INFO ? `error` : `log`,
    error: () => `error`,
    nextState: () => `info`,
  },
  duration: true,
  actionTransformer: (action) => ({
    ...action,
    type: String(action.type),
  }),
  colors: {
    prevState: () => `#FFEB3B`,
    action: ({ type }) => type === AUTH_SET_INFO && `red`,
    nextState: () => `#4CAF50`,
  },
  diff: true,
  diffPredicate: (getState, action) => action.type === AUTH_SET_TOKEN,
  persister: logPersister,
  persistenceDelay: 300,
});

const reducer = combineReducers(reducers);
const store = compose(
  applyMiddleware(logger)
)(createStore)(reducer);

const App = () => (
  <Provider store={store}>
    <Example />
  </Provider>
);

render(<App />, document.getElementById(`app`));

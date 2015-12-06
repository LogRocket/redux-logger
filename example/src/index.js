import 'normalize.css';
import 'styles/base';

import React from 'react';
import { render } from 'react-dom';
import createLogger from 'redux-logger';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import Example from 'components/example';
import reducers from 'reducers';
import { AUTH_REMOVE_TOKEN, AUTH_SET_INFO } from 'constants/auth';

const logger = createLogger({
  predicate: (getState, action) => action.type !== AUTH_REMOVE_TOKEN, // log all actions except AUTH_REMOVE_TOKEN
  level: `info`,
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

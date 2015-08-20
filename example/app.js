import React from 'react';
import createLogger from 'redux-logger';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import reducers from './reducers';
import { AUTH_REMOVE_TOKEN } from './constants/auth.js';

const logger = createLogger({
  predicate: (getState, action) => action.type !== AUTH_REMOVE_TOKEN, // log all actions except AUTH_REMOVE_TOKEN
  collapsed: true,
  level: 'warn',
});
const createStoreWithMiddleware = applyMiddleware(logger)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

import Example from './containers/example';

import 'styles/default';

React.render((
  <Provider store={store}>
    {() =>
      <Example />
    }
  </Provider>
), document.getElementById('app'));

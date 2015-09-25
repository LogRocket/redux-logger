import React, { Component } from 'react';
import createLogger from 'redux-logger';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import reducers from 'reducers';
import { AUTH_REMOVE_TOKEN } from 'constants/auth';

import Example from './example';

const logger = createLogger({
  predicate: (getState, action) => action.type !== AUTH_REMOVE_TOKEN, // log all actions except AUTH_REMOVE_TOKEN
  level: `info`,
  duration: true,
  actionTransformer: (action) => {
    return {
      ...action,
      type: String(action.type),
    };
  },
});

const reducer = combineReducers(reducers);
const store = compose(
  applyMiddleware(logger)
)(createStore)(reducer);

class RootContainer extends Component {
  render() {
    return (
      <Provider store={store}>
        {() =>
          <Example />
        }
      </Provider>
    );
  }
}

export default RootContainer;

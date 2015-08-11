import React from 'react';
import diffLogger from 'redux-diff-logger';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import reducers from './reducers';

function logger({ getState }) {
  return (next) => (action) => {
    // console.log(getState());
    // console.log(action);
    return next(action);
  };
}

const createStoreWithMiddleware = applyMiddleware(logger, diffLogger)(createStore);
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

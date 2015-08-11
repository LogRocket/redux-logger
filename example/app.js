import React from 'react';
import logger from 'redux-logger';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import reducers from './reducers';

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

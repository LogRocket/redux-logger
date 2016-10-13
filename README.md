# Logger for Redux
[![npm](https://img.shields.io/npm/v/redux-logger.svg?maxAge=2592000?style=plastic)]()
[![npm](https://img.shields.io/npm/dm/redux-logger.svg?maxAge=2592000?style=plastic)]()
[![Build Status](https://travis-ci.org/evgenyrodionov/redux-logger.svg?branch=master)](https://travis-ci.org/evgenyrodionov/redux-logger)
[![dependencies Status](https://david-dm.org/evgenyrodionov/redux-logger/status.svg)](https://david-dm.org/evgenyrodionov/redux-logger)

![redux-logger](http://i.imgur.com/pMR3OAv.png)

## Table of contents
* [Install](#install)
* [Usage](#usage)
* [API](#api)
* [Recipes](#recipes)
  * [Log only in development](#log-only-in-development)
  * [Transform `Symbol()` action type to string](#transform-symbol-action-type-to-string)
  * [Log everything except actions with certain type](#log-everything-except-actions-with-certain-type)
  * [Collapse actions with certain type](#collapse-actions-with-certain-type)
  * [Transform Immutable (without `combineReducers`)](#transform-immutable-without-combinereducers)
  * [Transform Immutable (with `combineReducers`)](#transform-immutable-with-combinereducers)
  * [Log batched actions](#log-batched-actions)
* [Known issues](#known-issues) (with `react-native` only at this moment)
* [License](#license)

## Install
`npm i --save redux-logger`

## Usage
```javascript
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';

const logger = createLogger();
const store = createStore(
  reducer,
  applyMiddleware(thunk, promise, logger)
);

// Note passing middleware as the third argument requires redux@>=3.1.0
```
Logger **must be** the last middleware in chain, otherwise it will log thunk and promise, not actual actions ([#20](https://github.com/evgenyrodionov/redux-logger/issues/20)).

## API

`redux-logger` exposes single constructor function for creating logger middleware.  

```
createLogger(options?: Object) => LoggerMiddleware
```

### Options
```javascript
{
  level = 'log': 'log' | 'console' | 'warn' | 'error' | 'info', // console's level
  duration = false: Boolean, // Print the duration of each action?
  timestamp = true: Boolean, // Print the timestamp with each action?
  colors: ColorsObject, // Object with color getters. See the ColorsObject interface.
  logger = console: LoggerObject, // Implementation of the `console` API.
  logErrors = true: Boolean, // Should the logger catch, log, and re-throw errors?
  collapsed, // Takes a boolean or optionally a function that receives `getState` function for accessing current store state and `action` object as parameters. Returns `true` if the log group should be collapsed, `false` otherwise.
  predicate, // If specified this function will be called before each action is processed with this middleware.
  stateTransformer, // Transform state before print. Eg. convert Immutable object to plain JSON.
  actionTransformer, // Transform state before print. Eg. convert Immutable object to plain JSON.
  errorTransformer, // Transform state before print. Eg. convert Immutable object to plain JSON.
  titleFormatter, // Format the title used when logging actions.
  diff = false: Boolean, // Show diff between states.
  diffPredicate // Filter function for showing states diff.'
}
```

### Options

#### __level (String | Function | Object)__
Level of `console`. `warn`, `error`, `info` or [else](https://developer.mozilla.org/en/docs/Web/API/console).

It can be a function `(action: Object) => level: String`.

It can be an object with level string for: `prevState`, `action`, `nextState`, `error`

It can be an object with getter functions: `prevState`, `action`, `nextState`, `error`. Useful if you want to print
message based on specific state or action. Set any of them to `false` if you want to hide it.

* `prevState(prevState: Object) => level: String`
* `action(action: Object) => level: String`
* `nextState(nextState: Object) => level: String`
* `error(error: Any, prevState: Object) => level: String`

*Default: `log`*

#### __duration (Boolean)__
Print duration of each action?

*Default: `false`*

#### __timestamp (Boolean)__
Print timestamp with each action?

*Default: `true`*

#### __colors (Object)__
Object with color getter functions: `title`, `prevState`, `action`, `nextState`, `error`. Useful if you want to paint
message based on specific state or action. Set any of them to `false` if you want to show plain message without colors.

* `title(action: Object) => color: String`
* `prevState(prevState: Object) => color: String`
* `action(action: Object) => color: String`
* `nextState(nextState: Object) => color: String`
* `error(error: Any, prevState: Object) => color: String`

#### __logger (Object)__
Implementation of the `console` API. Useful if you are using a custom, wrapped version of `console`.

*Default: `console`*

#### __logErrors (Boolean)__
Should the logger catch, log, and re-throw errors? This makes it clear which action triggered the error but makes "break
on error" in dev tools harder to use, as it breaks on re-throw rather than the original throw location.

*Default: `true`*

#### __collapsed = (getState: Function, action: Object) => Boolean__
Takes a boolean or optionally a function that receives `getState` function for accessing current store state and `action` object as parameters. Returns `true` if the log group should be collapsed, `false` otherwise.

*Default: `false`*

#### __predicate = (getState: Function, action: Object) => Boolean__
If specified this function will be called before each action is processed with this middleware.
Receives `getState` function for  accessing current store state and `action` object as parameters. Returns `true` if action should be logged, `false` otherwise.

*Default: `null` (always log)*

#### __stateTransformer = (state: Object) => state__
Transform state before print. Eg. convert Immutable object to plain JSON.

*Default: identity function*

#### __actionTransformer = (action: Object) => action__
Transform action before print. Eg. convert Immutable object to plain JSON.

*Default: identity function*

#### __errorTransformer = (error: Any) => error__
Transform error before print.

*Default: identity function*

#### __titleFormatter = (action: Object, time: String?, took: Number?) => title__
Format the title used for each action.

*Default: prints something like `action @ ${time} ${action.type} (in ${took.toFixed(2)} ms)`*

#### __diff (Boolean)__
Show states diff.

*Default: `false`*

#### __diffPredicate = (getState: Function, action: Object) => Boolean__
Filter states diff for certain cases.

*Default: `undefined`*

## Recipes
### Log only in development
```javascript
import thunk from 'redux-thunk';

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
  const createLogger = require(`redux-logger`);
  const logger = createLogger();
  middlewares.push(logger);
}

const store = compose(applyMiddleware(...middlewares))(createStore)(reducer);
```

### Transform `Symbol()` action type to string
```javascript
import createLogger from 'redux-logger';

const logger = createLogger({
  actionTransformer: (action) => ({
    ...action,
    type: String(action.type),
  })
});
```

### Log everything except actions with certain type
```javascript
createLogger({
  predicate: (getState, action) => action.type !== AUTH_REMOVE_TOKEN
});
```

### Collapse actions with certain type
```javascript
createLogger({
  collapsed: (getState, action) => action.type === FORM_CHANGE
});
```

### Transform Immutable (without `combineReducers`)
```javascript
import { Iterable } from 'immutable';

const stateTransformer = (state) => {
  if (Iterable.isIterable(state)) return state.toJS();
  else return state;
};

const logger = createLogger({
  stateTransformer,
});
```

### Transform Immutable (with `combineReducers`)
```javascript
const logger = createLogger({
  stateTransformer: (state) => {
    let newState = {};

    for (var i of Object.keys(state)) {
      if (Immutable.Iterable.isIterable(state[i])) {
        newState[i] = state[i].toJS();
      } else {
        newState[i] = state[i];
      }
    };

    return newState;
  }
});
```

### Log batched actions
Thanks to [@smashercosmo](https://github.com/smashercosmo)
```javascript
import createLogger from 'redux-logger';

const actionTransformer = action => {
  if (action.type === 'BATCHING_REDUCER.BATCH') {
    action.payload.type = action.payload.map(next => next.type).join(' => ');
    return action.payload;
  }

  return action;
};

const level = 'info';

const logger = {};

for (const method in console) {
  if (typeof console[method] === 'function') {
    logger[method] = console[method].bind(console);
  }
}

logger[level] = function levelFn(...args) {
  const lastArg = args.pop();

  if (Array.isArray(lastArg)) {
    return lastArg.forEach(item => {
      console[level].apply(console, [...args, item]);
    });
  }

  console[level].apply(console, arguments);
};

export default createLogger({
  level,
  actionTransformer,
  logger
});
```

## Known issues
* Performance issues in react-native ([#32](https://github.com/evgenyrodionov/redux-logger/issues/32))

## License
MIT

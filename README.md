# Logger for redux
[![Build Status](https://travis-ci.org/fcomb/redux-logger.svg?branch=master)](https://travis-ci.org/fcomb/redux-logger)

![logger](http://i.imgur.com/qhcz1OD.png)

## Install
`npm i --save redux-logger`

## Usage
```javascript
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(thunk, promise, logger)(createStore);
const store = createStoreWithMiddleware(reducer);
```
Logger **must be** last middleware in chain, otherwise it will log thunk and promise, not actual actions ([#20](https://github.com/fcomb/redux-logger/issues/20)).

## API

`redux-logger` exposes single constructor function for creating logger middleware.  

__createLogger(options?: Object)__

### Options

#### __level (String)__
Level of `console`. `warn`, `error`, `info` or [else](https://developer.mozilla.org/en/docs/Web/API/console).

*Default: `log`*

#### __logger (Object)__
Implementation of the `console` API. Useful if you are using a custom, wrapped version of `console`.

*Default: `window.console`*

#### __collapsed (getState: Function, action: Object): boolean__
Takes a boolean or optionally a function that receives `getState` function for accessing current store state and `action` object as parameters. Returns `true` if the log group should be collapsed, `false` otherwise.

*Default: `false`*

#### __predicate (getState: Function, action: Object): boolean__
If specified this function will be called before each action is processed with this middleware.
Receives `getState` function for  accessing current store state and `action` object as parameters. Returns `true` if action should be logged, `false` otherwise.

*Default: `null` (always log)*

#### __postProcessor (prevState: Object, nextState: Object, action: Object): object__
If specified this function will be called after each action is processed with this middleware.
Receives `prevState` object for previous store state, `nextState` object for next store state, and `action` object as parameters. Returns `false` if action should not be logged, or object `object` to change output settings, `false` otherwise.
`object` is expected in format `{color:string}`, where `color` will be applied to the grouping log message

*Default: `null` (always log)*

#### __duration (Boolean)__
Print duration of each action?

*Default: `false`*

#### __timestamp (Boolean)__
Print timestamp with each action?

*Default: `true`*

#### __transformer (Function)__
Transform state before print. Eg. convert Immutable object to plain JSON.

*Default: identity function*

#### __actionTransformer (Function)__
Transform action before print. Eg. convert Immutable object to plain JSON.

*Default: identity function*

### Examples:
#### log only in dev mode
```javascript
const __DEV__ = true;

createLogger({
  predicate: (getState, action) => __DEV__
});
```

#### log everything except actions with type `AUTH_REMOVE_TOKEN`
```javascript
createLogger({
  predicate: (getState, action) => action.type !== AUTH_REMOVE_TOKEN
});
```

#### log collapsed group message in gray color if state has not been mutated
```javascript
createLogger({
  postProcessor: (prevState, nextState, action) => {
    return prevState === nextState ? { color: "#ccc" } : true
  }
});
```

#### collapse all actions
```javascript
createLogger({
  collapsed: true
});
```

#### collapse actions with type `FORM_CHANGE`
```javascript
createLogger({
  collapsed: (getState, action) => action.type === FORM_CHANGE
});
```

#### transform Immutable objects into JSON
```javascript
createLogger({
  transformer: (state) => {
    var newState = {};
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


### License
MIT

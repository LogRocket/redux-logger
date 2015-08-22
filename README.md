# Logger for redux

![logger](http://i.imgur.com/qhcz1OD.png)

## Install
`npm i --save redux-logger`

## Usage
```javascript
import createLogger from 'redux-logger';

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(logger)(createStore);
const store = createStoreWithMiddleware(reducer);
```

## API

`redux-logger` exposes single constructor function for creating logger middleware.  

__createLogger(options?: Object)__

### Options
#### __level (String)__
Level of `console`. `warn`, `error`, `info` or [else](https://developer.mozilla.org/en/docs/Web/API/console).

*Default: `console.log`*

#### __logger (Object)__
Implementation of the `console` API. Useful if you are using a custom, wrapped version of `console`.

*Default: `window.console`*

#### __collapsed (Boolean)__
Is group collapsed?

*Default: `false`*

#### __predicate (getState: Function, action: Object): boolean__
If specified this function will be called before each action is processed with this middleware.
Receives `getState` function for  accessing current store state and `action` object as parameters. Returns `true` if action should be logged, `false` otherwise.

*Default: `null` (always log)*

#### __transform (Function)__
Transform state before print. Eg. convert Immutable object to plain JSON.

*Default: `null` (no transform)*


##### Examples:
###### log only in dev mode
```javascript
const __DEV__ = true;

createLogger({
  predicate: (getState, action) => __DEV__
});
```

###### log everything except actions with type `AUTH_REMOVE_TOKEN`

```javascript
createLogger({
  predicate: (getState, action) => action.type !== AUTH_REMOVE_TOKEN
});
```

### License
MIT

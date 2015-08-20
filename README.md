# Logger for redux

![logger](http://i.imgur.com/qhcz1OD.png)

### Install
`npm i --save redux-logger`

### Usage
```javascript
import createLogger from 'redux-logger';

const logger = createLogger({
  predicate: (getState, action) => action.type !== AUTH_REMOVE_TOKEN  // log all actions except AUTH_REMOVE_TOKEN
});
const createStoreWithMiddleware = applyMiddleware(logger)(createStore);
const store = createStoreWithMiddleware(reducer);
```

### API

`redux-logger` exposes single constructor function for creating logger middleware.  
_[flow type](http://flowtype.org/) notation is used hereinafter_

__createLogger(options?: Object)__

#### Options

__predicate__ - function with signature `predicate(getState: Function, action: Object): boolean`.  
If specified this function will be called before each action is processed with this middleware.
Receives `getState` function for  accessing current store state and `action` object as parameters. Returns `true` if action should be logged, `false` otherwise.

### License
MIT

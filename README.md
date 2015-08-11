# Diff logger between states for redux

![logger](http://i.imgur.com/SR5jsdm.png?1)

### Install
`npm i --save-dev redux-diff-logger`

### Usage
```
import logger from 'redux-diff-logger';

const createStoreWithMiddleware = applyMiddleware(logger)(createStore);
const store = createStoreWithMiddleware(reducer);
```

### License
MIT

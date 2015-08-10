# Diff logger between states for redux

![logger](http://s17.postimg.org/68pwjk0mn/fcomb_2015_08_10_12_28_18.png)

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

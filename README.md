# Logger for redux

![logger](http://i.imgur.com/qhcz1OD.png)

### Install
`npm i --save-dev redux-logger`

### Usage
```
import logger from 'redux-logger';

const createStoreWithMiddleware = applyMiddleware(logger)(createStore);
const store = createStoreWithMiddleware(reducer);
```

### License
MIT

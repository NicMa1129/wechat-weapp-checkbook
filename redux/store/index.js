import { createStore, compose} from '../../libs/redux.js';
// import logger from 'redux-logger'
// import thunkMiddleware from 'redux-thunk';
import devTools from '../../libs/remote-redux-devtools.js';
import reduce from '../reducer/index.js'

function configureStore() {
  return createStore(reduce, compose(devTools({
    hostname: 'localhost',
    port: 5678,
    secure: false
  })));
}

// const store = configureStore()
const store = createStore(reduce)

export default store
import { applyMiddleware, createStore, compose } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import storage from '../utils/storage';

export default function (initialState) {
  return createStore(rootReducer, initialState, composeWithDevTools({
      hostname: 'localhost', port: 8000,
    })(
    applyMiddleware(thunk),
    storage()
  ));
};

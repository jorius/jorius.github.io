// @packages
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';

// @reducers
import { rootReducer } from './reducers';

// @state
import initialState from './state/initial-state.json';

const createReduxStore = () => {
  const reduxLogger = createLogger();
  const middlewares = [
    reduxLogger,
    thunk,
  ];

  const state = initialState;

  const store = createStore(
    rootReducer,
    state,
    composeWithDevTools(
      applyMiddleware(...middlewares)
    )
  );

  return store;
};

export default createReduxStore();

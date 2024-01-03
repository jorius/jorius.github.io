// @packages
import { combineReducers } from 'redux';

// @scripts
import { githubReducer } from './github';
import { loadingReducer } from './loading';
import { settingsReducer } from './settings';

const mainReducer = combineReducers({
  github: githubReducer,
  loading: loadingReducer,
  settings: settingsReducer,
});

export const rootReducer = (state, action) => {
  const currentState = state;
  return mainReducer(currentState, action);
};

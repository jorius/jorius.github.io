// @packages
import { combineReducers } from 'redux';

// @config
import { configuration } from '../../configuration';

// @actions
import { SET_LANGUAGE_CODE } from '../actions';

const languageCodeReducer = (
  state = configuration.initialState.settings.languageCode, action
) => {
  switch (action.type) {
    case SET_LANGUAGE_CODE:
      return action.payload.languageCode;
    default:
      return state;
  }
};

export const settingsReducer = combineReducers({
  languageCode: languageCodeReducer,
});

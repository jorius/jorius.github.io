// @config
import { configuration } from '../../configuration';

// @actions
import { TOGGLE_LOADING_PAGE_VISIBILITY } from '../actions';

export const loadingReducer = (
  state = configuration.initialState.loading, action
) => {
  switch (action.type) {
    case TOGGLE_LOADING_PAGE_VISIBILITY:
      return action.payload;
    default:
      return state;
  }
};

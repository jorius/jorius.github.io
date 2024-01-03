// @packages
import { combineReducers } from 'redux';

// @config
import { configuration } from '../../configuration';

// @actions
import { GET_GITHUB_USER_REPOS } from '../actions';

const reposReducer = (
  state = configuration.initialState.github.repos, action
) => {
  switch (action.type) {
    case GET_GITHUB_USER_REPOS:
      return action.payload.repos.sort((a, b) => (a.name - b.name));
    default:
      return state;
  }
};

export const githubReducer = combineReducers({
  repos: reposReducer,
});

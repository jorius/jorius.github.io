// @packages
import axios from 'axios';

// @core
import { configuration } from '../../configuration';

// @utils
import { parseStringParams } from '../../utils';

// @constants
export const GET_GITHUB_USER_REPOS = 'GET_GITHUB_USER_REPOS';

export const getGithubUserRepos = (userName) => (dispatch) =>
  axios.get(parseStringParams(configuration.services.github.repos, userName))
    .then((response) => {
      const repositories = response.map(async (repo) => {
        let languages = await axios.get(repo.languages_url);
        languages = Object.keys(languages).map((key) => key);

        return {
          defaultBranch: repo.defaultBranch,
          description: repo.description,
          id: repo.id,
          language: repo.language,
          languages,
          name: repo.name,
          url: repo.html_url,
        };
      });

      Promise.all(repositories).then((repos) => dispatch({
        payload: { repos },
        type: GET_GITHUB_USER_REPOS,
      }));
    })
    .catch(Promise.reject);

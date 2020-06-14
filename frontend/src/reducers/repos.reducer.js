import { LOAD_LAST_WEEK_TOP_REPOS_STARTED, LOAD_LAST_WEEK_TOP_REPOS_SUCCESSFUL, LOAD_LAST_WEEK_TOP_REPOS_ERRORED, CHANGE_PAGE_SIZE, TOGGLE_REPO_STARRED, SET_LANGUAGE_FILTERS } from '../actions/repos.actions';
import config from '../config';
import { keyBy, filter, pick } from 'lodash';

const starredRepos = localStorage.starredRepos ? JSON.parse(localStorage.starredRepos) : [];
const reposReducer = (state = {
  starredRepos,
  starredReposIx: keyBy(starredRepos, 'id'),

  languageFilters: [],

  loadLastWeekTopReposStarted: false,
  loadLastWeekTopReposPage: 0,
  loadLastWeekTopReposPageError: null,

  lastWeekTopReposPageSize: localStorage.pageSize ? parseInt(localStorage.pageSize, 10) : config.repos.pageSize,
  lastWeekTopReposSelectedPage: null,
  lastWeekTopReposLastPage: null,
  lastWeekTopReposPageItems: null,
}, action) => {
  switch (action.type) {
    case LOAD_LAST_WEEK_TOP_REPOS_STARTED: {
      return { ...state,
        loadLastWeekTopReposStarted: true,
        loadLastWeekTopReposPage: action.page,
        loadLastWeekTopReposPageError: null
      };
    }
    case LOAD_LAST_WEEK_TOP_REPOS_SUCCESSFUL: {
      return { ...state,
        loadLastWeekTopReposStarted: false,
        loadLastWeekTopReposPage: 0,
        loadLastWeekTopReposPageError: null,

        lastWeekTopReposSelectedPage: action.page,
        lastWeekTopReposLastPage: action.lastPage,
        lastWeekTopReposPageItems: action.repos,
        lastWeekTopReposTotalItems: action.total,
      };
    }
    case LOAD_LAST_WEEK_TOP_REPOS_ERRORED: {
      return { ...state,
        loadLastWeekTopReposStarted: false,
        loadLastWeekTopReposPage: action.page,
        loadLastWeekTopReposPageError: action.error
      };
    }
    case CHANGE_PAGE_SIZE: {
      const selectedPage = Math.round((state.lastWeekTopReposSelectedPage - 1) * (state.lastWeekTopReposPageSize / action.pageSize) - 1e-6) + 1;
      return { ...state,
        lastWeekTopReposPageSize: action.pageSize,
        lastWeekTopReposSelectedPage: selectedPage,
        lastWeekTopReposLastPage: selectedPage
      };
    }
    case TOGGLE_REPO_STARRED: {
      const repo = pick(action.repo, 'id', 'name', 'description', 'html_url', 'stargazers_count', 'language');
      if(state.starredReposIx[repo.id]) {
        const starredReposIx = { ...state.starredReposIx };
        delete starredReposIx[repo.id];
        return { ...state,
          starredRepos: filter(state.starredRepos, ({ id }) => id !== repo.id),
          starredReposIx
        };
      }
      return { ...state,
        starredRepos: [ ...state.starredRepos, repo].sort((a, b) => b.stargazers_count - a.stargazers_count),
        starredReposIx: { ...state.starredReposIx, [repo.id]: repo }
      };
    }
    case SET_LANGUAGE_FILTERS: {
      return { ...state,
        languageFilters: action.languageFilters,
        lastWeekTopReposSelectedPage: 1,
        lastWeekTopReposLastPage: 1,
        lastWeekTopReposPageItems: []
      };
    }
    default: {
      return state;
    }
  }
}

export default reposReducer;

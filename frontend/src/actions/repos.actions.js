export const LOAD_LAST_WEEK_TOP_REPOS = 'repos.LOAD_LAST_WEEK_TOP_REPOS';
export const LOAD_LAST_WEEK_TOP_REPOS_STARTED = 'repos.LOAD_LAST_WEEK_TOP_REPOS_STARTED';
export const LOAD_LAST_WEEK_TOP_REPOS_SUCCESSFUL = 'repos.LOAD_LAST_WEEK_TOP_REPOS_SUCCESSFUL';
export const LOAD_LAST_WEEK_TOP_REPOS_ERRORED = 'repos.LOAD_LAST_WEEK_TOP_REPOS_ERRORED';

export const loadLastWeekTopRepos = (page) => ({
  type: LOAD_LAST_WEEK_TOP_REPOS,
  page
});
export const loadLastWeekTopReposStarted = (page) => ({
  type: LOAD_LAST_WEEK_TOP_REPOS_STARTED,
  page
});
export const loadLastWeekTopReposSuccessful = (page, lastPage, repos, total) => ({
  type: LOAD_LAST_WEEK_TOP_REPOS_SUCCESSFUL,
  page, lastPage, repos, total
});
export const loadLastWeekTopReposErrored = (page, error) => ({
  type: LOAD_LAST_WEEK_TOP_REPOS_ERRORED,
  page, error
});

export const CHANGE_PAGE_SIZE = 'repos.CHANGE_PAGE_SIZE';
export const changePageSize = (pageSize) => ({
  type: CHANGE_PAGE_SIZE,
  pageSize
});

export const TOGGLE_REPO_STARRED = 'repos.TOGGLE_REPO_STARRED';
export const toggleRepoStarred = (repo) => ({
  type: TOGGLE_REPO_STARRED,
  repo
});

export const SET_LANGUAGE_FILTERS = 'repos.SET_LANGUAGE_FILTERS';
export const setLanguageFilters = (languageFilters) => ({
  type: SET_LANGUAGE_FILTERS,
  languageFilters
});

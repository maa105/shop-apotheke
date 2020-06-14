import { of, concat, from as observableFrom } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { noopAction } from '../actions/core.actions';
import { LOAD_LAST_WEEK_TOP_REPOS, loadLastWeekTopRepos as loadLastWeekTopReposAction, loadLastWeekTopReposStarted, loadLastWeekTopReposSuccessful, loadLastWeekTopReposErrored, CHANGE_PAGE_SIZE, TOGGLE_REPO_STARRED, SET_LANGUAGE_FILTERS } from '../actions/repos.actions';
import { loadLastWeekTopRepos } from '../services/repos.service';

const loadLastWeekTopReposEpic = (action$, state$) => {
  return action$.pipe(
    ofType(LOAD_LAST_WEEK_TOP_REPOS),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      if(state.repos.loadLastWeekTopReposStarted && state.repos.loadLastWeekTopReposPage === action.page) {
        return of(noopAction());
      }

      return concat(
        of(loadLastWeekTopReposStarted(action.page)),
        observableFrom(
          loadLastWeekTopRepos(action.page, state.repos.lastWeekTopReposPageSize, state.repos.languageFilters)
          .then(({ page, lastPage, total, repos }) => (
            loadLastWeekTopReposSuccessful(page, lastPage, repos, total)
          ))
          .catch((error) => loadLastWeekTopReposErrored(action.page, error || true))
        )
      );

    })
  );
};

const changePageSizeEpic = (action$, state$) => {
  return action$.pipe(
    ofType(CHANGE_PAGE_SIZE),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      localStorage.pageSize = JSON.stringify(action.pageSize);
      return of(loadLastWeekTopReposAction(state.repos.lastWeekTopReposSelectedPage));
    })
  );
};

const setLanguageFiltersEpic = (action$, state$) => {
  return action$.pipe(
    ofType(SET_LANGUAGE_FILTERS),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      return of(loadLastWeekTopReposAction(state.repos.lastWeekTopReposSelectedPage));
    })
  );
};

const toggleRepoStarredEpic = (action$, state$) => {
  return action$.pipe(
    ofType(TOGGLE_REPO_STARRED),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      localStorage.starredRepos = JSON.stringify(state.repos.starredRepos);
      return of(noopAction());
    })
  );
};

const reposEpic = combineEpics(loadLastWeekTopReposEpic, changePageSizeEpic, setLanguageFiltersEpic, toggleRepoStarredEpic);
export default reposEpic;

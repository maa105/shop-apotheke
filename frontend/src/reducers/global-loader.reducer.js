import { LOAD_LAST_WEEK_TOP_REPOS_STARTED, LOAD_LAST_WEEK_TOP_REPOS_SUCCESSFUL, LOAD_LAST_WEEK_TOP_REPOS_ERRORED } from '../actions/repos.actions';

const globalLoaderReducer = (
  state = { show: false, count: 0 },
  action,
) => {
  switch(action.type) {
    case LOAD_LAST_WEEK_TOP_REPOS_STARTED: {
      return { show: true, count: state.count + 1 };
    }
    case LOAD_LAST_WEEK_TOP_REPOS_SUCCESSFUL:
    case LOAD_LAST_WEEK_TOP_REPOS_ERRORED: {
      return { show: state.count > 1, count: state.count - 1 };
    }
    default: {
      return state;
    }
  }
};

export default globalLoaderReducer;

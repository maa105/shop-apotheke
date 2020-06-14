import { LOAD_LAST_WEEK_TOP_REPOS, loadLastWeekTopRepos } from '../../actions/repos.actions';

it('load data action', () => {
  
  expect(LOAD_LAST_WEEK_TOP_REPOS).toEqual('repos.LOAD_LAST_WEEK_TOP_REPOS');
  expect(loadLastWeekTopRepos(10)).toEqual({ type: LOAD_LAST_WEEK_TOP_REPOS, page: 10 });

});

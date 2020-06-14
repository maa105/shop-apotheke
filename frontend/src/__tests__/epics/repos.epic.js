import { of, concat, from as observableFrom, setReturns as setRxJsReturns } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { noopAction } from '../../actions/core.actions';
import { LOAD_LAST_WEEK_TOP_REPOS, loadLastWeekTopReposStarted, loadLastWeekTopReposErrored, loadLastWeekTopReposSuccessful } from '../../actions/repos.actions';
import { loadLastWeekTopRepos, setReturns as setReposServiceReturns } from '../../services/repos.service';

import reposEpic from '../../epics/repos.epic';

jest.mock('../../services/repos.service', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    loadLastWeekTopRepos: jest.fn(() => returnFuncs.loadLastWeekTopRepos ? returnFuncs.loadLastWeekTopRepos() : returns.loadLastWeekTopRepos)
  };
});
jest.mock('redux-observable', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    combineEpics: jest.fn(() => {
      return returnFuncs.combineEpics ? returnFuncs.combineEpics() : returns.combineEpics;
    }),
    ofType: jest.fn(() => {
      return returnFuncs.ofType ? returnFuncs.ofType() : returns.ofType;
    })
  }
});
jest.mock('rxjs/operators', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    withLatestFrom: jest.fn(() => {
      return returnFuncs.withLatestFrom ? returnFuncs.withLatestFrom() : returns.withLatestFrom;
    }),
    mergeMap: jest.fn(() => {
      return returnFuncs.mergeMap ? returnFuncs.mergeMap() : returns.mergeMap;
    })
  }
});
jest.mock('rxjs', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    of: jest.fn(() => {
      return returnFuncs.of ? returnFuncs.of() : returns.of;
    }),
    concat: jest.fn(() => {
      return returnFuncs.concat ? returnFuncs.concat() : returns.concat;
    }),
    from: jest.fn(() => {
      return returnFuncs.from ? returnFuncs.from() : returns.from;
    })
  }
});

describe('repos.epic', () => {
  let loadLastWeekTopReposEpic;
  beforeAll(() => {
    loadLastWeekTopReposEpic = combineEpics.mock.calls[0][0];
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('loadLastWeekTopReposEpic calls action$.pipe(ofType(...), withLatestFrom(...), mergeMap(...))', async () => {
  
    const action$ = {
      pipe: jest.fn(() => 'pipe return')
    };
    const state$ = 'state$';
  
    loadLastWeekTopReposEpic(action$, state$);
  
    expect(action$.pipe.mock.calls.length).toEqual(1);
  
    expect(ofType.mock.calls.length).toEqual(1);
    expect(ofType.mock.calls[0]).toEqual([LOAD_LAST_WEEK_TOP_REPOS]);
  
    expect(withLatestFrom.mock.calls.length).toEqual(1);
    expect(withLatestFrom.mock.calls[0]).toEqual([state$]);
  
    expect(mergeMap.mock.calls.length).toEqual(1);
    expect(mergeMap.mock.calls[0].length).toEqual(1);
    
    const mergeMapFunc = mergeMap.mock.calls[0][0];
    expect(typeof(mergeMapFunc)).toEqual('function');
  });
  
  it('function sent to merge map returns of(noopAction()) if loading same page', async () => {
    const action$ = {
      pipe: jest.fn(() => 'pipe return')
    };
    const state$ = 'state$';
  
    loadLastWeekTopReposEpic(action$, state$);
    
    const mergeMapFunc = mergeMap.mock.calls[0][0];
    
    setRxJsReturns({ of: 'of ret' })
  
    let ret = mergeMapFunc([{ page: 5 }, { repos: { loadLastWeekTopReposStarted: true, loadLastWeekTopReposPage: 5 } }]);
    
    expect(ret).toEqual('of ret');
  
    expect(of.mock.calls.length).toEqual(1);
    expect(of.mock.calls[0][0]).toEqual(noopAction());
  
  });
  
  it('function sent to merge map returns a concatinated observable of loadLastWeekTopReposStarted and loadLastWeekTopReposSuccessful case successful loadLastWeekTopRepos', async () => {
    const action$ = {
      pipe: jest.fn(() => 'pipe return')
    };
    const state$ = 'state$';
  
    loadLastWeekTopReposEpic(action$, state$);
    
    const mergeMapFunc = mergeMap.mock.calls[0][0];
  
    const reposRetMock = { page: 10, lastPage: 100, total: 1000000, repos: [{ name: 'react-router-maa' }] };
    setReposServiceReturns({ loadLastWeekTopRepos: Promise.resolve(reposRetMock) });
    setRxJsReturns({ concat: 'concat ret', from: 'observableFrom ret' })
    let ret = mergeMapFunc([{ page: 10 }, { repos: {} }]);
  
    expect(ret).toEqual('concat ret');
  
    expect(concat.mock.calls.length).toEqual(1);
    expect(concat.mock.calls[0]).toEqual(['of ret', 'observableFrom ret']);
  
    expect(of.mock.calls.length).toEqual(1);
    expect(of.mock.calls[0][0]).toEqual(loadLastWeekTopReposStarted(10));
  
    expect(observableFrom.mock.calls.length).toEqual(1);
    expect((observableFrom.mock.calls[0][0]) instanceof Promise).toEqual(true);
  
    let result = await observableFrom.mock.calls[0][0];
    expect(result).toEqual(loadLastWeekTopReposSuccessful(10, 100, [{ name: 'react-router-maa' }], 1000000));
  });
  
  it('function sent to merge map returns a concatinated observable of loadLastWeekTopReposStarted and loadLastWeekTopReposErrored case loadLastWeekTopRepos errored', async () => {
    const action$ = {
      pipe: jest.fn(() => 'pipe return')
    };
    const state$ = 'state$';
  
    loadLastWeekTopReposEpic(action$, state$);
    
    const mergeMapFunc = mergeMap.mock.calls[0][0];
  
    setReposServiceReturns({ loadLastWeekTopRepos: Promise.reject('Some error') });
    setRxJsReturns({ concat: 'concat ret', from: 'observableFrom ret' })
    let ret = mergeMapFunc([{ page: 10 }, { repos: {} }]);
  
    expect(ret).toEqual('concat ret');
  
    expect(concat.mock.calls.length).toEqual(1);
    expect(concat.mock.calls[0]).toEqual(['of ret', 'observableFrom ret']);
  
    expect(of.mock.calls.length).toEqual(1);
    expect(of.mock.calls[0][0]).toEqual(loadLastWeekTopReposStarted(10));
  
    expect(observableFrom.mock.calls.length).toEqual(1);
    expect((observableFrom.mock.calls[0][0]) instanceof Promise).toEqual(true);
  
    let result = await observableFrom.mock.calls[0][0];
    expect(result).toEqual(loadLastWeekTopReposErrored(10, 'Some error'));
  });

  it('function sent to merge map returns a concatinated observable of loadLastWeekTopReposStarted and loadLastWeekTopReposErrored case loadLastWeekTopRepos errored, error falsy', async () => {
    const action$ = {
      pipe: jest.fn(() => 'pipe return')
    };
    const state$ = 'state$';
  
    loadLastWeekTopReposEpic(action$, state$);
    
    const mergeMapFunc = mergeMap.mock.calls[0][0];
  
    setReposServiceReturns({ loadLastWeekTopRepos: Promise.reject() });
    setRxJsReturns({ concat: 'concat ret', from: 'observableFrom ret' })
    let ret = mergeMapFunc([{ page: 10 }, { repos: {} }]);
  
    expect(ret).toEqual('concat ret');
  
    expect(concat.mock.calls.length).toEqual(1);
    expect(concat.mock.calls[0]).toEqual(['of ret', 'observableFrom ret']);
  
    expect(of.mock.calls.length).toEqual(1);
    expect(of.mock.calls[0][0]).toEqual(loadLastWeekTopReposStarted(10));
  
    expect(observableFrom.mock.calls.length).toEqual(1);
    expect((observableFrom.mock.calls[0][0]) instanceof Promise).toEqual(true);
  
    let result = await observableFrom.mock.calls[0][0];
    expect(result).toEqual(loadLastWeekTopReposErrored(10, true));
  });

});

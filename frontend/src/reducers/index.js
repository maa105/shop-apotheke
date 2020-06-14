import { combineReducers } from 'redux';
import coreReducer from './core.reducer';
import routerReducer from './router.reducer';
import reposReducer from './repos.reducer';
import globalLoaderReducer from './global-loader.reducer';
import layoutReducer from './layout.reducer';

const rootReducer = combineReducers({
  core: coreReducer,
  router: routerReducer,
  globalLoader: globalLoaderReducer,
  repos: reposReducer,
  layout: layoutReducer
});

export default rootReducer;

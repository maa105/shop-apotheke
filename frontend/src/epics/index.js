import { combineEpics } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import routerEpic from './router.epic';
import reposEpic from './repos.epic';

const epics = [routerEpic, reposEpic];

const rootEpic = (action$, store$, dependencies) =>
  combineEpics(...epics)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error('error in epics');
      console.error(error);
      return source;
    })
  );

export default rootEpic;

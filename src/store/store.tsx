import {combineReducers, createStore} from 'redux';
import user from '@store/user';
import project from '@store/project';
import service from '@store/service';

const reducers = combineReducers({
  [user.namespace]: user.reducer,
  [project.namespace]: project.reducer,
  [service.namespace]: service.reducer,
});
let store = createStore(reducers);

export default store;

import { combineReducers } from 'redux';
import tokenReducer from './tokenReducer';
import profileReducer from './profileReducer';
import notifyReducer from './notifyReducer';

const rootReducer =  combineReducers({
  tokenReducer: tokenReducer,
  profileReducer:profileReducer,
  notifyReducer:notifyReducer
});

export default rootReducer;
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import rootReducer from './reducers/rootReducer';
import profileReducer from './reducers/profileReducer';
import {composeWithDevTools} from 'redux-devtools-extension';


// Middleware: Redux Persist Config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    "tokenReducer",
    "profileReducer",
    "notifyReducer"
  ],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(
  persistedReducer,
 composeWithDevTools(applyMiddleware(
    createLogger(),
  )),
);

let persistor = persistStore(store);

export {store, persistor};

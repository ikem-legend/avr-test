// @flow
import {createStore, applyMiddleware, compose} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reducers from './reducers'
import sagas from './sagas'

const persistConfig = {
  key: 'avenir_',
  storage,
  blacklist: ['Layout', 'AppMenu'],
}
const persistedReducer = persistReducer(persistConfig, reducers)
const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
export function configureStore(initialState: {}) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(
    persistedReducer,
    // reducers,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
  sagaMiddleware.run(sagas)
  const persistor = persistStore(store)
  return {store, persistor}
}

import {all} from 'redux-saga/effects'
import layoutSaga from './layout/saga'
import authSaga from './auth/saga'
import appMenuSaga from './appMenu/saga'

/**
 * Root saga configuration
 */
export default function* rootSaga() {
  yield all([layoutSaga(), authSaga(), appMenuSaga()])
}

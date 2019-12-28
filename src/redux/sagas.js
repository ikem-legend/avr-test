import {all} from 'redux-saga/effects'
import layoutSaga from './layout/saga'
import authSaga from './auth/saga'

export default function* rootSaga(getState: any): any {
  yield all([layoutSaga(), authSaga()])
}

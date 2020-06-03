// @flow
import Cookies from 'js-cookie'
import {toast} from 'react-toastify'
import {all, call, fork, put, takeLatest} from 'redux-saga/effects'
import {callApi} from '../../helpers/api'
import {
  LOGIN_USER,
  LOGOUT_USER,
  REGISTER_USER,
  UPDATE_USER_DATA,
} from './constants'
import {
  loginUserSuccess,
  loginUserFailed,
  registerUserSuccess,
  registerUserFailed,
  updateUserDataSuccess,
} from './actions'

/**
 * Sets the session
 * @param {object} userData User object
 */
const setSession = userData => {
  if (userData) {
    // For some unusual reason cookies would fail from time to time
    // so it made more sense to use localStorage which was stable
    Cookies.set('avenirUser', userData)
    localStorage.setItem('avenirApp', userData)
  } else {
    Cookies.remove('avenirUser')
    localStorage.removeItem('avenirApp')
  }
}

/**
 * Login the user
 * @param {object} payload User and history data
 */
function* login({payload: {user, history}}) {
  try {
    const result = yield call(callApi, '/auth/signin', user, 'POST')
    const response = yield call(callApi, '/auth/me', user, 'GET', result.token)
    const {
      data: {
        myFirstName,
        myLastName,
        myEmailAddress,
        myPhoneNumber,
        myIdentifier,
        myContactAddress,
        myCurrencyDistributions,
        myMultiplierSetting,
        MyInvestmentPause,
        setup,
        myImage,
      },
    } = response
    const userObj = {}
    Object.assign(
      userObj,
      {
        myFirstName,
        myLastName,
        myEmailAddress,
        myPhoneNumber,
        myIdentifier,
        myContactAddress,
        myCurrencyDistributions,
        myMultiplierSetting,
        MyInvestmentPause,
        setup,
        myImage,
      },
      {token: result.token},
      {docUploadState: false},
    )
    const userObjStr = JSON.stringify(userObj)
    setSession(userObjStr)
    yield put(loginUserSuccess(userObj))
    history.push('/dashboard')
  } catch (error) {
    let message
    switch (error.status) {
      case 500:
        message = 'Internal Server Error'
        break
      case 401:
        message = 'Invalid credentials'
        break
      default:
        message = error
    }
    yield put(loginUserFailed(message))
    setSession(null)
  }
}

/**
 * Logout the user
 * @param {object} payload Logout payload
 */
function* logout({payload: {history}}) {
  try {
    setSession(null)
    yield call(() => {
      history.push('/account/login')
    })
  } catch (error) {
    console.log(error)
  }
}

/**
 * Register the user
 * @param {object} payload Register payload
 */
function* register({payload: {user, history}}) {
  try {
    const queryString = history.location.search
    const urlParams = new URLSearchParams(queryString)
    let result
    // This conditional was for the referral signup or basic signup
    if (urlParams === '') {
      result = yield call(callApi, '/auth/signup', user, 'POST')
    } else {
      result = yield call(callApi, `/auth/signup${urlParams}`, user, 'POST')
    }
    const response = yield call(
      callApi,
      '/auth/me',
      user,
      'GET',
      result.data.message.token,
    )
    const {data} = response
    const userObj = {}
    Object.assign(
      userObj,
      data,
      {token: result.data.message.token},
      {docUploadState: false},
    )
    const userObjStr = JSON.stringify(userObj)
    setSession(userObjStr)
    yield put(registerUserSuccess(userObj))
    history.push('/account/account-connect')
  } catch (error) {
    console.log(error)
    if (Object.keys(error).length) {
      Object.keys(error).map(obj =>
        toast.error(error[obj][0], {hideProgressBar: true}),
      )
    } else {
      toast.error(
        'Registration error. Please check your details and try again',
        {hideProgressBar: true},
      )
    }
    let message
    switch (error.status) {
      case 500:
        message = 'Internal Server Error'
        break
      case 401:
        message = 'Invalid credentials'
        break
      default:
        message = error
    }
    yield put(registerUserFailed(message))
  }
}

/**
 * update data to ensure side bar is always up to date
 * param {object} payload UserData payload
 */
function* updateData({payload: {userData}}) {
  try {
    const userDataStr = JSON.stringify(userData)
    setSession(userDataStr)
    yield put(updateUserDataSuccess(userData))
  } catch (err) {
    console.log(err)
  }
}

export function* watchLoginUser() {
  yield takeLatest(LOGIN_USER, login)
}

export function* watchLogoutUser() {
  yield takeLatest(LOGOUT_USER, logout)
}

export function* watchRegisterUser() {
  yield takeLatest(REGISTER_USER, register)
}

export function* watchUpdateData() {
  yield takeLatest(UPDATE_USER_DATA, updateData)
}

function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchRegisterUser),
    fork(watchUpdateData),
  ])
}

export default authSaga

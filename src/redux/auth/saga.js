// @flow
import {Cookies} from 'react-cookie'
import {all, call, fork, put, takeLatest} from 'redux-saga/effects'

import {callApi} from '../../helpers/api'

import {
  LOGIN_USER,
  LOGOUT_USER,
  REGISTER_USER,
  FORGET_PASSWORD,
} from './constants'

import {
  loginUserSuccess,
  loginUserFailed,
  registerUserSuccess,
  registerUserFailed,
  forgetPasswordSuccess,
  forgetPasswordFailed,
} from './actions'

/**
 * Sets the session
 * @param {object} user User object
 */
const setSession = user => {
  const cookies = new Cookies()
  // console.log(cookies, user)
  if (user) cookies.set('avenirUser', JSON.stringify(user), {path: '/'})
  else cookies.remove('avenirUser', {path: '/'})
}
/**
 * Login the user
 * @param {*} payload - username and password
 */
function* login({payload: {user, history}}) {
  // console.log(user, history)
  try {
    if (user.token) {
      setSession(user)
      yield put(loginUserSuccess(user))
      history.push('/account/account-connect')
    } else {
      const result = yield call(callApi, '/auth/signin', user, 'POST')
      const response = yield call(
        callApi,
        '/auth/me',
        user,
        'GET',
        result.token,
      )
      // console.log(response)
      const {
        data: {myFirstName, myLastName, myEmailAddress, myPhoneNumber},
      } = response
      const userObj = {}
      Object.assign(
        userObj,
        {myFirstName, myLastName, myEmailAddress, myPhoneNumber},
        {token: result.token},
      )
      // console.log(userObj)
      setSession(userObj)
      yield put(loginUserSuccess(userObj))
      yield call(() => history.push('/my-account'))
    }
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
 * @param {*} {object} payload
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
 */
function* register({payload: {user, history}}) {
  // console.log(user, history)
  // localStorage.setItem('avenir', 'abcd')
  try {
    const result = yield call(callApi, '/auth/signup', user, 'POST')
    // console.log(result.data.message.token)
    const response = yield call(
      callApi,
      '/auth/me',
      user,
      'GET',
      result.data.message.token,
    )
    // console.log(response)
    const {
      data: {myFirstName, myLastName, myEmailAddress, myPhoneNumber}
    } = response
    const userObj = {}
    Object.assign(
      userObj,
      {myFirstName, myLastName, myEmailAddress, myPhoneNumber},
      {token: result.data.message.token}
    )
    yield put(registerUserSuccess(userObj))
    // console.log(userObj)
    // Save user object in local storage for the meantime then if validation successful set cookie and/else delete from local storage
    localStorage.setItem('avenir', JSON.stringify(userObj))
    // console.log(localStorage.getItem('avenir'))
    // setSession(userObj);
    yield call(() => history.push('/account/verify'))
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
    yield put(registerUserFailed(message))
  }
}

/**
 * forget password
 */
function* forgetPassword({payload: {username}}) {
  const options = {
    body: JSON.stringify({username}),
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
  }

  try {
    const response = yield call(callApi, '/users/password-reset', options)
    yield put(forgetPasswordSuccess(response.message))
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
    yield put(forgetPasswordFailed(message))
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

export function* watchForgetPassword() {
  yield takeLatest(FORGET_PASSWORD, forgetPassword)
}

function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchRegisterUser),
    fork(watchForgetPassword),
  ])
}

export default authSaga

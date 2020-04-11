// @flow
// import Cookies from 'universal-cookie'
// import {Cookies} from 'react-cookie'
import Cookies from 'js-cookie'
import {toast} from 'react-toastify'
import {all, call, fork, put, takeLatest} from 'redux-saga/effects'

import {callApi} from '../../helpers/api'

import {
  LOGIN_USER,
  LOGOUT_USER,
  REGISTER_USER,
  FORGET_PASSWORD,
  UPDATE_USER_DATA,
} from './constants'

import {
  loginUserSuccess,
  loginUserFailed,
  registerUserSuccess,
  registerUserFailed,
  forgetPasswordSuccess,
  forgetPasswordFailed,
  updateUserDataSuccess,
} from './actions'

/**
 * Sets the session
 * @param {object} userData User object
 */
const setSession = userData => {
  // const cookies = new Cookies()
  // console.log(cookies, userData)
  if (userData) {
  	// debugger
  	Cookies.set('avenirUser', userData)
  	localStorage.setItem('avenirApp', userData)
  }
  else {
  	Cookies.remove('avenirUser')
  	localStorage.removeItem('avenirApp')
	}
	// debugger
  // console.log('Cookies: ', Cookies.get('avenirUser'))
}

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* login({payload: {user, history}}) {
  // console.log(user, history)
  try {
    // if (user.token) {
    //   setSession(user)
    //   yield put(loginUserSuccess(user))
    //   history.push('/account/account-connect')
    // } else {
    const result = yield call(callApi, '/auth/signin', user, 'POST')
    const response = yield call(
      callApi,
      '/auth/me',
      user,
      'GET',
      result.token,
    )
    const {
      // data,
      data: {myFirstName, myLastName, myEmailAddress, myPhoneNumber, myIdentifier, myContactAddress, myCurrencyDistributions, myMultiplierSetting, MyInvestmentPause, setup},
    } = response
    const userObj = {}
    Object.assign(
      userObj,
      // {...data},
      {myFirstName, myLastName, myEmailAddress, myPhoneNumber, myIdentifier, myContactAddress, myCurrencyDistributions, myMultiplierSetting, MyInvestmentPause, setup},
      {token: result.token},
    )
    const userObjStr = JSON.stringify(userObj)
    setSession(userObjStr)
    yield put(loginUserSuccess(userObj))
    history.push('/dashboard')
    // }
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
  try {
  	const queryString = history.location.search
  	const urlParams = new URLSearchParams(queryString);
  	let result
  	if (urlParams === '') {
    	result = yield call(callApi, '/auth/signup', user, 'POST')
  	} else {
  		result = yield call(callApi, `/auth/signup${urlParams}`, user, 'POST')
  	}
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
      data
      // data: {myFirstName, myLastName, myEmailAddress, myPhoneNumber},
    } = response
    const userObj = {}
    Object.assign(
      userObj,
      {...data},
      // {myFirstName, myLastName, myEmailAddress, myPhoneNumber},
      {token: result.data.message.token},
    )
    const userObjStr = JSON.stringify(userObj)
    setSession(userObjStr)
    yield put(registerUserSuccess(userObj))
    // debugger
    history.push('/account/account-connect')
  } catch (error) {
  	console.log(error)
  	Object.keys(error).map(obj => (
	    toast.error(
	    	error[obj][0],
	    	{hideProgressBar: true}
	    )
  	))
  	// console.log(error.email[0])
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
    // toast.error(
    // 	'Registration error. Please check your details and try again',
    // 	{hideProgressBar: true}
    // )
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

function* updateData({payload: {userData}}) {
	try {
		const userDataStr = JSON.stringify(userData)
    setSession(userDataStr)
		yield put(updateUserDataSuccess(userData))
	} catch(err) {
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

export function* watchForgetPassword() {
  yield takeLatest(FORGET_PASSWORD, forgetPassword)
}

export function* watchUpdateData() {
  yield takeLatest(UPDATE_USER_DATA, updateData)
}

function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchRegisterUser),
    fork(watchForgetPassword),
    fork(watchUpdateData),
  ])
}

export default authSaga

// @flow
import { Cookies } from 'react-cookie';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { callApi } from '../../helpers/api';

import { LOGIN_USER, LOGOUT_USER, REGISTER_USER, FORGET_PASSWORD } from './constants';

import {
    loginUserSuccess,
    loginUserFailed,
    registerUserSuccess,
    registerUserFailed,
    forgetPasswordSuccess,
    forgetPasswordFailed,
} from './actions';

/**
 * Sets the session
 * @param {object} user
 */
const setSession = user => {
    let cookies = new Cookies();
    // console.log(cookies, user)
    if (user) cookies.set('user', JSON.stringify(user), { path: '/' });
    else cookies.remove('user', { path: '/' });
};
/**
 * Login the user
 * @param {*} payload - username and password
 */
function* login({ payload: { user, history } }) {
    console.log(user, history)
    try {
        const result = yield call(callApi, '/auth/signin', user, 'POST');
        const response = yield call(callApi, '/auth/me', user, 'GET', result.token);
        // console.log(response)
        const {data: {myFirstName, myLastName, myEmailAddress, myPhoneNumber}} = response
        const userObj = {}
        Object.assign(userObj, {myFirstName, myLastName, myEmailAddress, myPhoneNumber}, {token: result.token})
        // console.log(userObj)
        setSession(userObj);
        yield put(loginUserSuccess(userObj));
        yield call(() => history.push('/dashboard'))
    } catch (error) {
        let message;
        switch (error.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'Invalid credentials';
                break;
            default:
                message = error;
        }
        yield put(loginUserFailed(message));
        setSession(null);
    }
}

/**
 * Logout the user
 * @param {*} {object} payload
 */
function* logout({ payload: { history } }) {
    try {
        setSession(null);
        yield call(() => {
            history.push('/account/login');
        });
    } catch (error) {}
}

/**
 * Register the user
 */
function* register({payload: {user}}) {
    // console.log(user)
    try {
        const response = yield call(callApi, '/auth/signup', user, 'POST');
        yield put(registerUserSuccess(response));
        // yield call(() => history.push('/dashboard'))
    } catch (error) {
        let message;
        switch (error.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'Invalid credentials';
                break;
            default:
                message = error;
        }
        yield put(registerUserFailed(message));
    }
}

/**
 * forget password
 */
function* forgetPassword({ payload: { username } }) {
    const options = {
        body: JSON.stringify({ username }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        const response = yield call(callApi, '/users/password-reset', options);
        yield put(forgetPasswordSuccess(response.message));
    } catch (error) {
        let message;
        switch (error.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'Invalid credentials';
                break;
            default:
                message = error;
        }
        yield put(forgetPasswordFailed(message));
    }
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, login);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, register);
}

export function* watchForgetPassword() {
    yield takeEvery(FORGET_PASSWORD, forgetPassword);
}

function* authSaga() {
    yield all([fork(watchLoginUser), fork(watchLogoutUser), fork(watchRegisterUser), fork(watchForgetPassword)]);
}

export default authSaga;

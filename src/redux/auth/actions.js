// @flow
import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILED,
  LOGOUT_USER,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILED,
  UPDATE_USER_DATA,
  UPDATE_USER_DATA_SUCCESS,
} from './constants'

export const loginUser = (user, history) => ({
  type: LOGIN_USER,
  payload: {user, history},
})

export const loginUserSuccess = user => ({
  type: LOGIN_USER_SUCCESS,
  payload: user,
})

export const loginUserFailed = error => ({
  type: LOGIN_USER_FAILED,
  payload: error,
})

export const registerUser = (user, history) => ({
  type: REGISTER_USER,
  payload: {user, history},
})

export const registerUserSuccess = user => ({
  type: REGISTER_USER_SUCCESS,
  payload: user,
})

export const registerUserFailed = error => ({
  type: REGISTER_USER_FAILED,
  payload: error,
})

export const logoutUser = history => ({
  type: LOGOUT_USER,
  payload: {history},
})

export const updateUserData = userData => ({
  type: UPDATE_USER_DATA,
  payload: {userData},
})

export const updateUserDataSuccess = userData => ({
  type: UPDATE_USER_DATA_SUCCESS,
  payload: userData,
})

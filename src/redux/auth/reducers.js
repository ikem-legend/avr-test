// @flow
import {getLoggedInUser} from '../../helpers/authUtils'
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

const INIT_STATE = {
  user: getLoggedInUser(),
  loading: false,
}

const Auth = (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {...state, loading: true}
    case LOGIN_USER_SUCCESS:
      return {...state, user: action.payload, loading: false, error: null}
    case LOGIN_USER_FAILED:
      return {...state, error: action.payload, loading: false}
    case REGISTER_USER:
      return {...state, loading: true}
    case REGISTER_USER_SUCCESS:
      return {...state, user: action.payload, loading: false, error: null}
    case REGISTER_USER_FAILED:
      return {...state, error: action.payload, loading: false}
    case LOGOUT_USER:
      return {...state, user: null}
    case UPDATE_USER_DATA:
      return {...state, loading: true}
    case UPDATE_USER_DATA_SUCCESS:
      return {...state, user: action.payload, loading: false, error: null}
    default:
      return {...state}
  }
}

export default Auth

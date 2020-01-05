import {combineReducers} from 'redux'
import Layout from './layout/reducers'
import Auth from './auth/reducers'

export default combineReducers({
  Layout,
  Auth
})

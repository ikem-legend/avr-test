// @flow
import jwtDecode from 'jwt-decode'
import {Cookies} from 'react-cookie'

/**
 * Returns the logged in user
 */
const getLoggedInUser = () => {
  const cookies = new Cookies()
  const user = cookies.get('user')
  // console.log(user)
  return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null
}

/**
 * Checks if user is authenticated
 */
const isUserAuthenticated = () => {
  const user = getLoggedInUser()
  if (!user) {
    return false
  }
  const decoded = jwtDecode(user.token)
  // console.log(decoded)
  const currentTime = Date.now() / 1000
  // console.log(decoded.exp < currentTime)
  if (decoded.exp < currentTime) {
    console.warn('access token expired')
    return false
  } else {
    return true
  }
}

export {isUserAuthenticated, getLoggedInUser}

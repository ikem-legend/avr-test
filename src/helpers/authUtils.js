// @flow
// import jwtDecode from 'jwt-decode'
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
  // Add condtion for other pages before dashboard like account and credit card linking
  const user = getLoggedInUser()
  const userInStorage = localStorage.getItem('avenir')
  if (!user) {
    return false
  }
  if (user && userInStorage) {
    // This is done to prevent auth layout during the account and credit card connection pages
    return false
  }
  return true
  // const decoded = jwtDecode(user.token)
  // // console.log(decoded)
  // const currentTime = Date.now() / 1000
  // // console.log(decoded.exp < currentTime)
  // if (decoded.exp < currentTime) {
  //   console.warn('access token expired')
  //   return false
  // } else {
  //   return true
  // }
}

export {isUserAuthenticated, getLoggedInUser}

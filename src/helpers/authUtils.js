// @flow
// import jwtDecode from 'jwt-decode'
import {Cookies} from 'react-cookie'

/**
 * Returns the logged in user
 * @returns {object} user User object
 */
const getLoggedInUser = () => {
  const cookies = new Cookies()
  const user = cookies.get('avenirUser')
  // console.log(user)
  return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null
}

/**
 * Checks if user is authenticated
 * @returns {bool} Auth Authentication status
 */
const isUserAuthenticated = () => {
  // Add condtion for other pages before dashboard like account and credit card linking
  const user = getLoggedInUser()
  // const userInStorage = localStorage.getItem('avenir')
  // const url = window.location.pathname
  if (user) {
    // Temp fix
    // if (user && userInStorage && url === '/account/login') {
    //   return true
    // }
    // if (user && userInStorage && url === 'account/account-connect') {
    //   // This is done to prevent auth layout during the account and credit card connection pages
    //   // However it led to some login bugs when there was both cookies and local storage data
    //   // This is a temp solution but a rewrite of unauth pages should fix it
    //   return false
    // }
    if (user && !user.setup.bankAccountSetup && !user.setup.cardSetup) {
      debugger
      return false
    }
    return true
  } else {
    return false
  }
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

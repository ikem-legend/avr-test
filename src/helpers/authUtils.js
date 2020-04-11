// @flow
// import jwtDecode from 'jwt-decode'
// import Cookies from 'universal-cookie'
// import {Cookies} from 'react-cookie'
// import Cookies from 'js-cookie'

/**
 * Returns the logged in user
 * @returns {object} user User object
 */
const getLoggedInUser = () => {
  // const cookies = new Cookies()
  // const user = Cookies.get('avenirUser')
  const user = localStorage.getItem('avenirApp')
  // const avenirUser = JSON.parse(localStorage.getItem('persist:avenir_'))
  // console.log(avenirUser.Auth, typeof(avenirUser.Auth))
  // console.log(avenirUser.Auth.user, typeof(avenirUser.Auth.user))
  // console.log(avenirUser && avenirUser.Auth && avenirUser.Auth.user ? JSON.parse(avenirUser.Auth.user) : null)
  return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null
  // return avenirUser && avenirUser.Auth ? (typeof avenirUser.Auth.user == 'object' ? avenirUser : JSON.parse(avenirUser.Auth)) : null
  // return avenirUser && avenirUser.Auth ? avenirUser.Auth.user : null
}

/**
 * Checks if user is authenticated
 * @returns {bool} Auth Authentication status
 */
const isUserAuthenticated = () => {
  // Add condtion for other pages before dashboard like account and credit card linking
  const user = getLoggedInUser()
  // debugger
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
    // if (!user.setup.bankAccountSetup.done) {
    //   // debugger
    //   return true
    // }
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

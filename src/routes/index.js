import React from 'react'
import {connect} from 'react-redux'
import {Route, Redirect} from 'react-router-dom'
import * as FeatherIcon from 'react-feather'
// import * as Unicons from '@iconscout/react-unicons'
// import UilReact from '@iconscout/react-unicons/icons/uil-react'

import {isUserAuthenticated} from '../helpers/authUtils'
// import { isUserAuthenticated, getLoggedInUser } from '../helpers/authUtils';

// home
const Home = React.lazy(() => import('../pages/home'))

// auth
const Login = React.lazy(() => import('../pages/auth/Login'))
const Logout = React.lazy(() => import('../pages/auth/Logout'))
const Signup = React.lazy(() => import('../pages/auth/Signup'))
// const Verify = React.lazy(() => import('../pages/auth/Verify'))
const AccountConnect = React.lazy(() => import('../pages/auth/AccountConnect'))
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'))

// dashboard
const Dashboard = React.lazy(() => import('../pages/dashboard'))
const Transactions = React.lazy(() => import('../pages/transactions'))
const Account = React.lazy(() => import('../pages/account'))
// const Referral = React.lazy(() => import('../pages/referral'))
const Faq = React.lazy(() => import('../pages/faq'))

// handle auth and authorization
const PrivateRoute = ({component: Component, user, ...rest}) => (
  <Route
    {...rest}
    debugger
    render={props => {
      // debugger
      // console.log(Component.WrappedComponent)
      // console.log(Component)
      if (!isUserAuthenticated()) {
        // not logged in so redirect to login page with the return url
        return (
          <Redirect
            to={{pathname: '/account/login', state: {from: props.location}}}
          />
        )
      }
      const loggedInUser = isUserAuthenticated()
      const url = window.location.pathname
      // check if route is restricted by role
      // if (roles && roles.indexOf(loggedInUser.role) === -1) {
      //   // role not authorised so redirect to home page
      //   return <Redirect to={{ pathname: '/' }} />;
      // }
      if (loggedInUser && url === '/account/account-connect') {
        // authorised so return component
        return <Component {...props} />
      }

      // authorised so return component
      return <Component {...props} />
    }}
  />
)

const mapStateToProps = state => {
  const {user} = state.Auth
  return {user}
}

export default connect(mapStateToProps)(PrivateRoute)

// home
const homeRoutes = {
  path: '/',
  name: 'Home',
  icon: FeatherIcon.Home,
  component: Home,
  route: Route,
  exact: true,
}

// dashboards
const dashboardRoutes = {
  path: '/dashboard',
  name: 'Dashboard',
  icon: FeatherIcon.Home,
  // header: 'Navigation',
  // badge: {
  //   variant: 'success',
  //   text: '1',
  // },
  component: Dashboard,
  route: PrivateRoute,
}

// transactions
const transactionRoutes = {
  path: '/transactions',
  name: 'Transactions',
  icon: FeatherIcon.CreditCard,
  // icon: Unicons.UilUsersAlt,
  component: Transactions,
  route: PrivateRoute,
}

// referrals
// const referralRoutes = {
//   path: '/referral',
//   name: 'Referral',
//   icon: FeatherIcon.Share2,
//   component: Referral,
//   route: PrivateRoute,
// }

// accounts
const accountRoutes = {
  path: '/my-account',
  name: 'My Account',
  icon: FeatherIcon.User,
  // icon: Unicons.UilUsersAlt,
  component: Account,
  route: PrivateRoute,
}

// faq
const faqRoutes = {
  path: '/faq',
  // path: '/faq',
  name: 'FAQs',
  icon: FeatherIcon.MessageSquare,
  // icon: Unicons.UilCommentAltLines,
  component: Faq,
  route: PrivateRoute,
}

// // support
// const supportRoutes = {
//   path: '#',
//   // path: '/faq',
//   name: 'Support',
//   icon: FeatherIcon.MessageSquare,
//   // icon: Unicons.UilCommentAltNotes,
//   component: Dashboard,
//   route: PrivateRoute,
// }

// auth
const authRoutes = {
  path: '/account',
  name: 'Auth',
  children: [
    {
      path: '/account/login',
      name: 'Login',
      component: Login,
      route: Route,
    },
    {
      path: '/account/logout',
      name: 'Logout',
      component: Logout,
      route: Route,
    },
    {
      path: '/account/signup',
      name: 'Signup',
      component: Signup,
      route: Route,
    },
    // {
    //   path: '/account/verify',
    //   name: 'Verify',
    //   component: Verify,
    //   route: Route,
    // },
    {
      path: '/account/account-connect',
      name: 'AccountConnect',
      component: AccountConnect,
      route: PrivateRoute,
    },
    {
      path: '/account/forgot-password',
      name: 'Forgot Password',
      component: ForgotPassword,
      route: Route,
    },
  ],
}

const appRoutes = [transactionRoutes, accountRoutes, faqRoutes]
// const appRoutes = [transactionRoutes, accountRoutes, referralRoutes, faqRoutes, supportRoutes]

// flatten the list of all nested routes
const flattenRoutes = routes => {
  let flatRoutes = []

  routes = routes || []
  routes.forEach(item => {
    flatRoutes.push(item)

    if (typeof item.children !== 'undefined') {
      flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)]
    }
  })
  return flatRoutes
}

// All routes
const allRoutes = [homeRoutes, authRoutes, dashboardRoutes, ...appRoutes]
const authProtectedRoutes = [
  dashboardRoutes,
  transactionRoutes,
  accountRoutes,
  // referralRoutes,
  faqRoutes,
  // supportRoutes,
]
// const authProtectedRoutes = [dashboardRoutes, transactionRoutes, referralRoutes, accountRoutes, learnRoutes, faqRoutes]
const allFlattenRoutes = flattenRoutes(allRoutes)

export {allFlattenRoutes, authProtectedRoutes}

import React from 'react'
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
const Verify = React.lazy(() => import('../pages/auth/Verify'))
const AccountConnect = React.lazy(() => import('../pages/auth/AccountConnect'))
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'))

// dashboard
const Dashboard = React.lazy(() => import('../pages/dashboard'))
const Transactions = React.lazy(() => import('../pages/transactions'))
const Account = React.lazy(() => import('../pages/account'))

// handle auth and authorization
const PrivateRoute = ({component: Component, roles, ...rest}) => (
  <Route
    {...rest}
    render={props => {
      if (!isUserAuthenticated()) {
        // not logged in so redirect to login page with the return url
        return (
          <Redirect
            to={{pathname: '/account/login', state: {from: props.location}}}
          />
        )
      }

      // const loggedInUser = getLoggedInUser();
      // check if route is restricted by role
      // if (roles && roles.indexOf(loggedInUser.role) === -1) {
      //   // role not authorised so redirect to home page
      //   return <Redirect to={{ pathname: '/' }} />;
      // }

      // authorised so return component
      return <Component {...props} />
    }}
  />
)

// home
const homeRoutes = {
  path: '/',
  name: 'Home',
  icon: FeatherIcon.Home,
  component: Home,
  route: Route,
  exact: true
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
//   path: '#',
//   // path: '/referral',
//   name: 'Referral',
//   icon: FeatherIcon.Share2,
//   // header: 'Navigation',
//   // badge: {
//   //   variant: 'success',
//   //   text: '1',
//   // },
//   component: Dashboard,
//   // roles: ['Admin'],
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
  path: '#',
  // path: '/faq',
  name: 'FAQs',
  icon: FeatherIcon.MessageSquare,
  // icon: Unicons.UilCommentAltLines,
  component: Dashboard,
  route: PrivateRoute,
}

// support
const supportRoutes = {
  path: '#',
  // path: '/faq',
  name: 'Support',
  icon: FeatherIcon.MessageSquare,
  // icon: Unicons.UilCommentAltNotes,
  component: Dashboard,
  route: PrivateRoute,
}

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
    {
      path: '/account/verify',
      name: 'Verify',
      component: Verify,
      route: Route,
    },
    {
      path: '/account/account-connect',
      name: 'AccountConnect',
      component: AccountConnect,
      route: Route,
    },
    {
      path: '/account/forgot-password',
      name: 'Forgot Password',
      component: ForgotPassword,
      route: Route,
    },
  ],
}

const appRoutes = [transactionRoutes, accountRoutes, faqRoutes, supportRoutes]
// const appRoutes = [transactionRoutes, referralRoutes, accountRoutes, learnRoutes, faqRoutes]

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
  faqRoutes,
  supportRoutes,
]
// const authProtectedRoutes = [dashboardRoutes, transactionRoutes, referralRoutes, accountRoutes, learnRoutes, faqRoutes]
const allFlattenRoutes = flattenRoutes(allRoutes)

export {allFlattenRoutes, authProtectedRoutes}

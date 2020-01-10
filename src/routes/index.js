import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import * as FeatherIcon from 'react-feather'

import {isUserAuthenticated} from '../helpers/authUtils'
// import { isUserAuthenticated, getLoggedInUser } from '../helpers/authUtils';

// auth
const Login = React.lazy(() => import('../pages/auth/Login'))
// const Logout = React.lazy(() => import('../pages/auth/Logout'));
const Signup = React.lazy(() => import('../pages/auth/Signup'))
const Verify = React.lazy(() => import('../pages/auth/Verify'))
const AccountConnect = React.lazy(() => import('../pages/auth/AccountConnect'))
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'))
// dashboard
const Dashboard = React.lazy(() => import('../pages/dashboard'))

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
  // roles: ['Admin'],
  route: PrivateRoute,
}

// transactions
const transactionRoutes = {
  // path: '/transactions',
  name: 'Transactions',
  icon: FeatherIcon.CreditCard,
  // header: 'Navigation',
  // badge: {
  //   variant: 'success',
  //   text: '1',
  // },
  component: Dashboard,
  route: PrivateRoute,
}

// referrals
const referralRoutes = {
  path: '/referral',
  name: 'Referral',
  icon: FeatherIcon.Share2,
  // header: 'Navigation',
  // badge: {
  //   variant: 'success',
  //   text: '1',
  // },
  component: Dashboard,
  // roles: ['Admin'],
  route: PrivateRoute,
}

// accounts
const accountRoutes = {
  path: '/account',
  name: 'My Account',
  icon: FeatherIcon.User,
  // header: 'Navigation',
  // badge: {
  //   variant: 'success',
  //   text: '1',
  // },
  component: Dashboard,
  // roles: ['Admin'],
  route: PrivateRoute,
}

// learn
const learnRoutes = {
  path: '/learn',
  name: 'Learn',
  icon: FeatherIcon.MessageCircle,
  // header: 'Navigation',
  // badge: {
  //   variant: 'success',
  //   text: '1',
  // },
  component: Dashboard,
  // roles: ['Admin'],
  route: PrivateRoute,
}

// faq
const faqRoutes = {
  path: '/faq',
  name: 'FAQ and Support',
  icon: FeatherIcon.MessageSquare,
  // header: 'Navigation',
  // badge: {
  //   variant: 'success',
  //   text: '1',
  // },
  component: Dashboard,
  // roles: ['Admin'],
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
    // {
    //     path: '/account/logout',
    //     name: 'Logout',
    //     component: Logout,
    //     route: Route,
    // },
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
    // {
    //     path: '/account/confirm',
    //     name: 'Confirm',
    //     component: Confirm,
    //     route: Route,
    // },
    {
      path: '/account/forgot-password',
      name: 'Forgot Password',
      component: ForgotPassword,
      route: Route,
    },
  ],
}

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
const allRoutes = [authRoutes, dashboardRoutes]
const authProtectedRoutes = [dashboardRoutes, transactionRoutes, referralRoutes, accountRoutes, learnRoutes, faqRoutes]
const allFlattenRoutes = flattenRoutes(allRoutes)

export {allFlattenRoutes, authProtectedRoutes}

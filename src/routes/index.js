import React from 'react'
import {Route} from 'react-router-dom'
// import {Route, Redirect} from 'react-router-dom'

// auth
const Login = React.lazy(() => import('../pages/auth/Login'))
// const Logout = React.lazy(() => import('../pages/auth/Logout'));
const Signup = React.lazy(() => import('../pages/auth/Signup'))
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'))

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
const allRoutes = [authRoutes]
const allFlattenRoutes = flattenRoutes(allRoutes)

export {allFlattenRoutes}

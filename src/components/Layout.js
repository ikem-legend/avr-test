// @flow
import React, {Component, Suspense} from 'react'
import {connect} from 'react-redux'

import {isUserAuthenticated} from '../helpers/authUtils'
import * as layoutConstants from '../constants/layout'
import Loader from './Loader'

// Lazy loading and code splitting -
// Derived idea from https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const loading = () => (
  <div>
    <Loader />
  </div>
)

// All layouts/containers
const AuthLayout = React.lazy(() => import('../layouts/Auth'))
const VerticalLayout = React.lazy(() => import('../layouts/Vertical'))
const HorizontalLayout = React.lazy(() => import('../layouts/Horizontal'))

/**
 * Exports the component with layout wrapped to it
 * @param {} WrappedComponent
 * @returns {object} HOC
 */
const withLayout = WrappedComponent => {
  const HOC = class extends Component {
    /**
     * Returns the layout component based on different properties
     * @returns {object} Layout component
     */
    getLayout = () => {
      const url = window.location.pathname
      // debugger
      if (isUserAuthenticated() && url === '/account/account-connect')
        return VerticalLayout
      // if (isUserAuthenticated() && url === '/account/account-connect') {debugger; return VerticalLayout}
      if (!isUserAuthenticated()) return AuthLayout
      // if (!isUserAuthenticated()) {debugger; return AuthLayout;}
      // if (!isUserAuthenticated() && url !== '/account/account-connect') return AuthLayout

      let layoutCls = VerticalLayout
      // debugger
      switch (this.props.layout.layoutType) {
        case layoutConstants.LAYOUT_HORIZONTAL:
          layoutCls = HorizontalLayout
          break
        default:
          layoutCls = VerticalLayout
          break
      }
      return layoutCls
    }

    render() {
      const Layout = this.getLayout()
      return (
        <Suspense fallback={loading()}>
          <Layout {...this.props}>
            <WrappedComponent {...this.props} />
          </Layout>
        </Suspense>
      )
    }
  }

  const mapStateToProps = state => {
    return {
      layout: state.Layout,
      auth: state.Auth,
    }
  }

  return connect(mapStateToProps)(HOC)
}

export default withLayout

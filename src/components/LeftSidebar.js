import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Progress} from 'reactstrap'

import {isMobileOnly} from 'react-device-detect'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'

// import {
//   UncontrolledDropdown,
//   DropdownMenu,
//   DropdownToggle,
//   DropdownItem,
// } from 'reactstrap'
import {getLoggedInUser} from '../helpers/authUtils'

import profilePic from '../assets/images/users/user-profile@2x.png'
import AppMenu from './AppMenu'

/**
 * User Widget
 */
const UserProfile = () => {
  const user = getLoggedInUser()
  // console.log(user)
  return (
    <Fragment>
      <div className="media user-profile user-avatar mt-2">
        <img
          src={profilePic}
          className="avatar-lg rounded-circle mr-2"
          alt="Avenir"
        />
        <img
          src={profilePic}
          className="avatar-xs rounded-circle mr-2"
          alt="Avenir"
        />
      </div>

        <div className="media-body user-profile details mb-2">
          <h4 className="pro-user-name mt-2 mb-0">Hi {user.myFirstName},</h4>
          <div className="mt-2 mb-4">{user.myEmailAddress}</div>
          <div>Account Setup - <span className="setup">75%</span></div>
          <Progress value="75" className="setup-level"></Progress>
        </div>
    </Fragment>
  )
}

/**
 * Sidenav
 */
const SideNav = () => {
  return (
    <div className="sidebar-content">
      <div id="sidebar-menu">
        <AppMenu />
      </div>
    </div>
  )
}

class LeftSidebar extends Component {
  menuNodeRef

  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleOtherClick = this.handleOtherClick.bind(this)
  }

  /**
   * Bind event
   */
  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleOtherClick, false)
  }

  /**
   * Bind event
   */
  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleOtherClick, false)
  }

  /**
   * Handle the click anywhere in doc
   */
  handleOtherClick = e => {
    if (this.menuNodeRef.contains(e.target)) return
    // else hide the menubar
    if (document.body && isMobileOnly) {
      document.body.classList.remove('sidebar-enable')
    }
  }

  /**
   * Handle click
   * @param {*} e
   * @param {*} item
   */
  handleClick(e) {
    console.log(e)
  }

  render() {
    const isCondensed = this.props.isCondensed || false

    return (
      <Fragment>
        <div className="left-side-menu" ref={node => (this.menuNodeRef = node)}>
          <UserProfile />
          {!isCondensed && (
            <PerfectScrollbar>
              <SideNav />
            </PerfectScrollbar>
          )}
          {isCondensed && <SideNav />}
        </div>
      </Fragment>
    )
  }
}

export default connect()(LeftSidebar)

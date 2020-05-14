import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Progress} from 'reactstrap'
import {isMobileOnly} from 'react-device-detect'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'

import {getLoggedInUser} from '../helpers/authUtils'
import profilePic from '../assets/images/users/default-user-avatar.svg'
import AppMenu from './AppMenu'

/**
 * User Widget
 * @param {object} user User prop
 * @returns {node} User Profile details
 */
const UserProfile = ({user}) => {
  return (
    <Fragment>
      <div className="media user-profile user-avatar mt-2">
        <img
          src={/jpg|jpeg$/.test(user.myImage) ? user.myImage : profilePic}
          className="avatar-lg rounded-circle img-fluid mr-2"
          alt="Avenir"
        />
      </div>
      <div className="media-body user-profile details mb-2">
        <h4 className="pro-user-name mt-2 mb-0">Hi {user.myFirstName},</h4>
        <div className="mt-2 mb-4">{user.myEmailAddress}</div>
        <div>
          Account Setup -{' '}
          <span className="setup">{user.setup && user.setup.total}%</span>
        </div>
        <Progress
          value={user.setup && user.setup.total}
          className="setup-level"
        />
      </div>
    </Fragment>
  )
}

/**
 * Sidenav
 * @returns {node} Sidebar Nav
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
    this.state = {
      userData: getLoggedInUser(),
    }
  }

  /**
   * Bind event
   */
  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleOtherClick, false)
  }

  componentDidUpdate = prevProps => {
    // const user = getLoggedInUser()
    if (
      prevProps.auth.user.setup.total < this.props.auth.user.setup.total ||
      prevProps.auth.user.myImage !== this.props.auth.user.myImage
    ) {
      this.updateUserData(this.props.auth.user)
    }
  }

  /**
   * Bind event
   */
  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleOtherClick, false)
  }

  updateUserData = value => {
    this.setState({
      userData: value,
    })
  }

  /**
   * Handle the click anywhere in doc
   * @param {object} e Global event object
   */
  handleOtherClick = e => {
    if (this.menuNodeRef.contains(e.target)) return
    // else hide the menubar
    if (document.body && isMobileOnly) {
      document.body.classList.remove('sidebar-enable')
    }
  }

  render() {
    const isCondensed = this.props.isCondensed || false
    const {userData} = this.state
    return (
      <div className="left-side-menu" ref={node => (this.menuNodeRef = node)}>
        <UserProfile user={userData} />
        {!isCondensed && (
          <PerfectScrollbar>
            <SideNav />
          </PerfectScrollbar>
        )}
        {isCondensed && <SideNav />}
      </div>
    )
  }
}

export default connect()(LeftSidebar)

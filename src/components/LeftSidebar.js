import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Progress} from 'reactstrap'
import {isMobileOnly} from 'react-device-detect'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'

import {getLoggedInUser} from '../helpers/authUtils'
// import profilePic from '../assets/images/users/default-avatar.png'
// import profilePic from '../assets/images/users/user-profile@2x.png'
import AppMenu from './AppMenu'

/**
 * User Widget
 */
const UserProfile = ({user}) => {
  // const user = getLoggedInUser()
  return (
    <Fragment>
      <div className="media user-profile user-avatar mt-2">
        {/* <img
          src={profilePic}
          className="avatar-lg rounded-circle mr-2"
          alt="Avenir"
        /> */}
        {/* <img
          src={profilePic}
          className="avatar-xs rounded-circle mr-2"
          alt="Avenir"
        /> */}
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
        ></Progress>
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
    this.state = {
      userData: getLoggedInUser(),
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleOtherClick = this.handleOtherClick.bind(this)
  }

  /**
   * Bind event
   */
  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleOtherClick, false)
  }

  componentDidUpdate = prevProps => {
    // const user = getLoggedInUser()
    // debugger
    if (prevProps.auth.user.setup.total < this.props.auth.user.setup.total) {
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
    const {userData} = this.state
    return (
      <Fragment>
        <div className="left-side-menu" ref={node => (this.menuNodeRef = node)}>
          <UserProfile user={userData} />
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

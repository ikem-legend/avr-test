import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {
  Row,
  Col,
  Progress,
  CustomInput,  
  TabPane,
  TabContent,
  Nav, 
  NavItem, 
  NavLink
} from 'reactstrap'
import classnames from 'classnames'

import {isUserAuthenticated} from '../../helpers/authUtils'
// import { getLoggedInUser, isUserAuthenticated } from '../../helpers/authUtils'
import Loader from '../../components/Loader'
import profilePic from '../../assets/images/users/user-profile@2x.png'

import EditProfile from './EditProfile'
import AccountSettings from './AccountSettings'
// import TopUpsTable from './TopUpsTable'
// import WithdrawalTable from './WithdrawalTable'
// import InvestmentChart from './InvestmentChart'

class Account extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stage1: true,
      stage2: true,
      stage3: true,
      stage4: false,
      activeTab: '1'
    }
  }

  updateValue = e => {
    console.log(e.target.checked)
    this.setState({
      roundup: e.target.value,
    })
  }

  toggle = tab => {
    console.log(tab)
    console.log(typeof tab)
    if (tab !== this.state.activeTab) {
      this.setState({
        activeTab: tab,
      })
    }
  }

  /**
   * Redirect to root
   * @returns {object} Redirect component
   */
  renderRedirectToRoot = () => {
    const isAuthTokenValid = isUserAuthenticated()
    if (!isAuthTokenValid) {
      return <Redirect to="/account/login" />
    }
  }

  render() {
    const {stage1, stage2, stage3, stage4, activeTab} = this.state
    const {user} = this.props

    return (
      <Fragment>
        {this.renderRedirectToRoot()}
        <div className="">
          {/* preloader */}
          {this.props.loading && <Loader />}

          <Row className="page-title">
            <Col md={3}>
              <div className="account-profile">
                <h6>My Account</h6>
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
                <h4 className="mb-4">
                  {user.myFirstName} {user.myLastName}
                </h4>
                <hr />
                <span>{user.myEmailAddress}</span>
                <p className="mt-1 mb-3">
                  <span>{user.myPhoneNumber}</span>
                </p>
                <div className="mt-3">
                  Account Setup - <span className="setup">75%</span>
                </div>
                <Progress value="75" className="setup-level" />
                <hr />
                <div className="reg-status mb-2">
                  <CustomInput
                    type="checkbox"
                    id="reg-stage-1"
                    label="Link my bank account"
                    checked={stage1}
                    readOnly
                  />
                  <span className="ml-4 font-weight-bold complete">Complete</span>
                </div>
                <div className="reg-status mb-2">
                  <CustomInput
                    type="checkbox"
                    id="reg-stage-2"
                    label="Link my credit card(s)"
                    checked={stage2}
                    readOnly
                  />
                  <span className="ml-4 font-weight-bold complete">Complete</span>
                </div>
                <div className="reg-status mb-2">
                  <CustomInput
                    type="checkbox"
                    id="reg-stage-3"
                    label="Set a round-up multiplier"
                    checked={stage3}
                    readOnly
                  />
                  <span className="ml-4 font-weight-bold complete">Complete</span>
                </div>
                <div className="reg-status">
                  <CustomInput
                    type="checkbox"
                    id="reg-stage-4"
                    label="Make your first top-up"
                    checked={stage4}
                    readOnly
                  />
                  <span className="ml-4 font-weight-bold incomplete">Incomplete</span>
                </div>
              </div>
            </Col>
            <Col md={9}>
              <div className="account-settings">
                <div className="nav-container">
                  <Row>
                    <Col md={12}>
                      <Nav tabs>
                        <Col md={3}>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === '1' }, 'text-center')}
                              onClick={() => { this.toggle('1'); }}
                            >
                              Edit Profile
                            </NavLink>
                          </NavItem>
                        </Col>
                        <Col md={3}>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === '2' }, 'text-center')}
                              onClick={() => { this.toggle('2'); }}
                            >
                              Account Settings
                            </NavLink>
                          </NavItem>
                        </Col>
                        <Col md={3}>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === '3' }, 'text-center')}
                              onClick={() => { this.toggle('3'); }}
                            >
                              Banks & Cards
                            </NavLink>
                          </NavItem>
                        </Col>
                        <Col md={3}>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === '4' }, 'text-center')}
                              onClick={() => { this.toggle('4'); }}
                            >
                              Security
                            </NavLink>
                          </NavItem>
                        </Col>              
                      </Nav>
                    </Col>
                  </Row> 
                </div>
                <div className="tab-container">
                  <Row>
                    <Col md={12}>
                      <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                          <div className="p-4">
                            <EditProfile />
                          </div>
                        </TabPane>
                        <TabPane tabId="2">
                          <div className="p-4">
                            <AccountSettings />
                          </div>
                        </TabPane>
                      </TabContent>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps)(Account)

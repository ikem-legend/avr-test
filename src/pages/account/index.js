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
  NavLink,
} from 'reactstrap'
import classnames from 'classnames'

import {isUserAuthenticated} from '../../helpers/authUtils'
import {callApi} from '../../helpers/api'
import Loader from '../../components/Loader'
import profilePic from '../../assets/images/users/user-profile@2x.png'

import EditProfile from './EditProfile'
import AccountSettings from './AccountSettings'
import Security from './Security'
import BanksCards from './BanksCards'
import {showFeedback} from '../../redux/actions'

class Account extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bankAccountSetup: false,
      cardSetup: false,
      topup: false,
      multiplierSetup: false,
      documentUpload: false,
      total: 0,
      activeTab: '1',
    }
  }

  componentDidMount() {
    this.loadUserData()
  }

  loadUserData = () => {
    const {user} = this.props
    callApi('/auth/me', null, 'GET', user.token)
      .then(res => {
        const {
          setup: {
            bankAccountSetup,
            cardSetup,
            multiplierSetup,
            topup,
            documentUpload,
            total,
          },
        } = res.data
        this.setState({
          bankAccountSetup: bankAccountSetup.done,
          cardSetup: cardSetup.done,
          multiplierSetup: multiplierSetup.done,
          topup: topup.done,
          documentUpload: documentUpload.done,
          total,
        })
      })
      .catch(err => {
        this.props.showFeedback(err, 'error')
      })
  }

  toggle = tab => {
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
    console.log('look here')
    const isAuthTokenValid = isUserAuthenticated()
    if (!isAuthTokenValid) {
      return <Redirect to="/account/login" />
    }
  }

  render() {
    const {
      bankAccountSetup,
      cardSetup,
      multiplierSetup,
      topup,
      documentUpload,
      total,
      activeTab,
    } = this.state
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
                <h4 data-testid="username-display" className="mb-4">
                  {user.myFirstName} {user.myLastName}
                </h4>
                <hr />
                <span data-testid="email-display">{user.myEmailAddress}</span>
                <p data-testid="phone-display" className="mt-1 mb-3">
                  <span>{user.myPhoneNumber}</span>
                </p>
                <div className="mt-3">
                  Account Setup - <span className="setup">{total}%</span>
                </div>
                <Progress value={total} className="setup-level" />
                <hr />
                <div className="reg-status mb-3">
                  <CustomInput
                    type="checkbox"
                    id="reg-stage-1"
                    label="Link my bank account"
                    checked={bankAccountSetup}
                    readOnly
                  />
                  <span
                    className={classnames(
                      {complete: bankAccountSetup === true},
                      {incomplete: bankAccountSetup === false},
                      'ml-4 font-weight-bold',
                    )}
                  >
                    {bankAccountSetup ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="reg-status mb-3">
                  <CustomInput
                    type="checkbox"
                    id="reg-stage-2"
                    label="Link my credit card(s)"
                    checked={cardSetup}
                    readOnly
                  />
                  <span
                    className={classnames(
                      {complete: cardSetup === true},
                      {incomplete: cardSetup === false},
                      'ml-4 font-weight-bold',
                    )}
                  >
                    {cardSetup ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="reg-status mb-3">
                  <CustomInput
                    type="checkbox"
                    id="reg-stage-3"
                    label="Set a round-up multiplier"
                    checked={multiplierSetup}
                    readOnly
                  />
                  <span
                    className={classnames(
                      {complete: multiplierSetup === true},
                      {incomplete: multiplierSetup === false},
                      'ml-4 font-weight-bold',
                    )}
                  >
                    {multiplierSetup ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="reg-status mb-3">
                  <CustomInput
                    type="checkbox"
                    id="reg-stage-4"
                    label="Upload User ID"
                    checked={documentUpload}
                    readOnly
                  />
                  <span
                    className={classnames(
                      {complete: documentUpload === true},
                      {incomplete: documentUpload === false},
                      'ml-4 font-weight-bold',
                    )}
                  >
                    {documentUpload ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="reg-status">
                  <CustomInput
                    type="checkbox"
                    id="reg-stage-5"
                    label="Make your first top-up"
                    checked={topup}
                    readOnly
                  />
                  <span
                    className={classnames(
                      {complete: topup === true},
                      {incomplete: topup === false},
                      'ml-4 font-weight-bold',
                    )}
                  >
                    {topup ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>
            </Col>
            <Col md={9}>
              <div className="account-settings">
                <div className="nav-container">
                  <Row>
                    <Col md={12}>
                      <Nav tabs>
                        <Col md={3} className="p-0">
                          <NavItem>
                            <NavLink
                              className={classnames(
                                {active: activeTab === '1'},
                                'text-center',
                              )}
                              onClick={() => {
                                this.toggle('1')
                              }}
                            >
                              Edit Profile
                            </NavLink>
                          </NavItem>
                        </Col>
                        <Col md={3} className="p-0">
                          <NavItem>
                            <NavLink
                              className={classnames(
                                {active: activeTab === '2'},
                                'text-center',
                              )}
                              onClick={() => {
                                this.toggle('2')
                              }}
                            >
                              Account Settings
                            </NavLink>
                          </NavItem>
                        </Col>
                        <Col md={3} className="p-0">
                          <NavItem>
                            <NavLink
                              className={classnames(
                                {active: activeTab === '3'},
                                'text-center',
                              )}
                              onClick={() => {
                                this.toggle('3')
                              }}
                            >
                              Banks & Cards
                            </NavLink>
                          </NavItem>
                        </Col>
                        <Col md={3} className="p-0">
                          <NavItem>
                            <NavLink
                              className={classnames(
                                {active: activeTab === '4'},
                                'text-center',
                              )}
                              onClick={() => {
                                this.toggle('4')
                              }}
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
                        <TabPane tabId="3">
                          <div className="p-4">
                            <BanksCards />
                          </div>
                        </TabPane>
                        <TabPane tabId="4">
                          <div className="p-4">
                            <Security />
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

export default connect(mapStateToProps, {showFeedback})(Account)

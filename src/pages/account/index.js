import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {Row, Col, TabPane, TabContent, Nav, NavItem, NavLink} from 'reactstrap'
import classnames from 'classnames'

import {isUserAuthenticated} from '../../helpers/authUtils'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'
import Loader from '../../components/Loader'

import {AccountProfile} from './AccountProfile'
import EditProfile from './EditProfile'
import AccountSettings from './AccountSettings'
import Security from './Security'
import BanksCards from './BanksCards'

class Account extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      phone: '',
      dob: 0,
      address: '',
      referralUrl: '',
      accounts: [],
      bankAccountSetup: false,
      topup: false,
      multiplierSetup: false,
      documentUploadStatus: '',
      documentUpload: false,
      total: 0,
      twofactorAuth: false,
      notifications: false,
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
          myFirstName,
          myLastName,
          myEmailAddress,
          myPhoneNumber,
          myBirthDay,
          myContactAddress,
          myIdentifier,
          plaidBanks,
          appNotifications,
          twofactorAuthStatus,
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
          name: `${myFirstName} ${myLastName}`,
          email: myEmailAddress,
          phone: myPhoneNumber ? myPhoneNumber : '',
          dob: myBirthDay,
          address: myContactAddress ? myContactAddress : '',
          referralUrl: myIdentifier ? myIdentifier : '',
          accounts: plaidBanks,
          bankAccountSetup: bankAccountSetup.done,
          multiplierSetup: multiplierSetup.done,
          topup: topup.done,
          documentUpload: documentUpload.done,
          documentUploadStatus: documentUpload.status,
          total,
          notifications: appNotifications,
          twofactorAuth: twofactorAuthStatus,
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
    const isAuthTokenValid = isUserAuthenticated()
    if (!isAuthTokenValid) {
      return <Redirect to="/account/login" />
    }
  }

  render() {
    const {
      name,
      email,
      phone,
      dob,
      address,
      referralUrl,
      accounts,
      bankAccountSetup,
      multiplierSetup,
      topup,
      documentUpload,
      documentUploadStatus,
      total,
      notifications,
      twofactorAuth,
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
              <AccountProfile
                user={user}
                bankAccountSetup={bankAccountSetup}
                total={total}
                multiplierSetup={multiplierSetup}
                documentUpload={documentUpload}
                documentUploadStatus={documentUploadStatus}
                topup={topup}
              />
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
                            <EditProfile
                              name={name}
                              email={email}
                              phone={phone}
                              dob={dob}
                              address={address}
                              referralUrl={referralUrl}
                              loadUserData={this.loadUserData}
                            />
                          </div>
                        </TabPane>
                        <TabPane tabId="2">
                          <div className="p-4">
                            <AccountSettings />
                          </div>
                        </TabPane>
                        <TabPane tabId="3">
                          <div className="p-4">
                            <BanksCards bankAccounts={accounts} />
                          </div>
                        </TabPane>
                        <TabPane tabId="4">
                          <div className="p-4">
                            <Security
                              user={user}
                              twoFA={twofactorAuth}
                              notifications={notifications}
                              updateUserData={this.loadUserData}
                            />
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

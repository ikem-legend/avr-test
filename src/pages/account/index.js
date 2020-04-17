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
      accountsConnectList: [],
      accountsFSList: [],
      loadingAcctLink: false,
      bankAccountSetup: false,
      topup: false,
      multiplierSetup: false,
      documentUploadStatus: '',
      documentUploadError: null,
      documentUpload: false,
      total: 0,
      twofactorAuth: false,
      notifications: false,
      activeTab: '3',
    }
  }

  componentDidMount() {
    this.loadUserData()
  }
  // document
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
            multiplierSetup,
            topup,
            documentUpload,
            total,
          },
        } = res.data
        const acctArr = []
        const acctFSArr = []
        const accountsLinkedList = plaidBanks.map(acc => {
          acc.accounts.map(details => {
            details.link = details.accountLink
            details.fundingSource = details.accountFundingSource
            acctArr.push(details)
            acctFSArr.push(details)
            return details
          })
          return acc
          // Object.keys(acc).forEach(key => key !== 'id' && delete acc[key])
        })
        // Deep copy needed to avoid overwriting account details
        // Create an array for the accounts with only id and value and this is
        // then used to track sttate of each account for linking and unlinking
        const accountsConnectArr = JSON.parse(JSON.stringify(acctArr)).map(acctDet => {
          Object.keys(acctDet).forEach(key => (key !== 'id' && key !== 'link') && delete acctDet[key])
          return acctDet
        })
        const accountsFSArr = JSON.parse(JSON.stringify(acctFSArr)).map(acctDet => {
          Object.keys(acctDet).forEach(key => (key !== 'id' && key !== 'fundingSource') && delete acctDet[key])
          return acctDet
        })
        this.setState({
          name: `${myFirstName} ${myLastName}`,
          email: myEmailAddress,
          phone: myPhoneNumber ? myPhoneNumber : '',
          dob: myBirthDay,
          address: myContactAddress ? myContactAddress : '',
          referralUrl: myIdentifier ? myIdentifier : '',
          accounts: accountsLinkedList,
          // accounts: plaidBanks,
          accountsConnectList: accountsConnectArr,
          accountsFSList: accountsFSArr,
          acctFundingSource: res.data.plaidBankAccountFundingSource,
          bankAccountSetup: bankAccountSetup.done,
          multiplierSetup: multiplierSetup.done,
          topup: topup.done,
          documentUpload: documentUpload.done,
          documentUploadStatus: documentUpload.status,
          documentUploadError: documentUpload.error,
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

  accountsLinked = (id, val) => {
    const {accountsConnectList} = this.state
    const tempList = accountsConnectList.map(acc => {
      if (acc.id === id) {
        return {...acc, link: val}
      }
      return acc
    })
    this.setState({
      accountsConnectList: tempList,
    })
  }

  fundingSourceLinked = (id, val) => {
    const {accountsFSList} = this.state
    const tempList = accountsFSList.map(acc => {
      if (acc.id === id) {
        return {...acc, fundingSource: val}
      }
      return acc
    })
    this.setState({
      accountsFSList: tempList,
    })
  }

  connectSelectedAccts = () => {
    const {accountsConnectList, accountsFSList} = this.state
    const {user} = this.props
    const accountsObj = {accounts_link: accountsConnectList}
    // Check if single funding source
    const filteredFS = accountsFSList.filter(fs => fs.fundingSource === true)
    if (filteredFS.length === 1) {
      this.setState({loadingAcctLink: true});
      callApi('/user/plaid/bank/account/link', accountsObj, 'POST', user.token)
        .then(() => {
          this.props.showFeedback('Account(s) successfully linked', 'success')
          this.connectFundingSource(filteredFS[0])
        })
        .catch(err => {
          console.log(err)
          this.setState({loadingAcctLink: false});
          this.props.showFeedback('Error linking account(s)', 'error')
        })
    } else {
      this.props.showFeedback('Please specify only one funding source', 'error')
    }
  }

  connectFundingSource = (val) => {
    const {user} = this.props
    const fsObj = {funding_source: val.fundingSource, bank_account_id: val.id}
    callApi('/user/plaid/bank/account/funding/source', fsObj, 'POST', user.token)
      .then(() => {
        this.props.showFeedback('Funding source successfully updated', 'success')
        this.setState({loadingAcctLink: false});
        this.loadUserData()
      })
      .catch(err => {
        console.log(err)
        this.setState({loadingAcctLink: false});
        this.props.showFeedback('Error updating funding source', 'error')
      })
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
    const {name, email, phone, dob, address, referralUrl, accounts, acctFundingSource, bankAccountSetup, multiplierSetup, topup, documentUpload, documentUploadStatus, documentUploadError, total, notifications, twofactorAuth, activeTab, loadingAcctLink} = this.state
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
                documentUploadError={documentUploadError}
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
                            <BanksCards
                              bankAccounts={accounts}
                              acctFundingSource={acctFundingSource}
                              accountsLinked={this.accountsLinked}
                              fundingSource={this.fundingSourceLinked}
                              loadingAcctLink={loadingAcctLink}
                              connectSelectedAccts={this.connectSelectedAccts}
                              loadUserData={this.loadUserData}
                            />
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

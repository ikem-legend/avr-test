import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {
  Row,
  Col,
  TabPane,
  TabContent,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'
import classnames from 'classnames'
import isEqual from 'lodash/isEqual'
import {isUserAuthenticated} from '../../helpers/authUtils'
import {callApi} from '../../helpers/api'
import {showFeedback, updateUserData} from '../../redux/actions'
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
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: 0,
      address: '',
      city: '',
      country: '',
      zipCode: 12345,
      referralUrl: '',
      multiplier: '1',
      btc: 50,
      eth: 50,
      invPause: false,
      loadingRoundup: false,
      loadingCoinDstrbn: false,
      currDist: {},
      accounts: [],
      accountsConnectList: [],
      accountsFSList: [],
      accountModal: true,
      loadingAcctLink: false,
      bankAccountSetup: false,
      topup: false,
      multiplierSetup: false,
      documentUploadStatus: '',
      documentUploadError: null,
      documentUpload: false,
      total: 0,
      image: null,
      twofactorAuth: false,
      notifications: false,
      checkDetails: {},
      activeTab: '1',
    }
  }

  componentDidMount() {
    this.loadUserData()
  }
  // document
  loadUserData = (mlprUpdate = false, imgUpdate = false) => {
    const {user} = this.props
    callApi('/auth/me', null, 'GET', user.token)
      .then(res => {
        const {myFirstName, myLastName, myEmailAddress, myPhoneNumber, myBirthDay, myContactAddress, myContactCity, myContactCountry, myZipCode, myIdentifier, MyInvestmentPause, myMultiplierSetting, myCurrencyDistributions, plaidBanks, appNotifications, twofactorAuthStatus, setup: {bankAccountSetup, multiplierSetup, topup, documentUpload, total}, myImage} = res.data
        const multiplierList = {1: '1', 2: '2', 3: '5', 4: '10'}
        const btcVal = myCurrencyDistributions[0].percentage
        const ethVal = myCurrencyDistributions[1].percentage
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
          firstName: myFirstName,
          lastName: myLastName,
          email: myEmailAddress,
          phone: myPhoneNumber ? myPhoneNumber : '',
          dob: new Date(myBirthDay),
          // dob: myBirthDay * 1000,
          address: myContactAddress ? myContactAddress : '',
          city: myContactCity,
          country: myContactCountry,
          zipCode: myZipCode ? myZipCode : '',
          referralUrl: myIdentifier ? myIdentifier : '',
          multiplier: multiplierList[myMultiplierSetting],
          invPause: MyInvestmentPause,
          btc: btcVal,
          eth: ethVal,
          currDist: {btc: btcVal, eth: ethVal}, // stores a copy of the distribution for display
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
          image: myImage,
          notifications: appNotifications,
          twofactorAuth: twofactorAuthStatus,
          checkDetails: {
            invPause: MyInvestmentPause,
            multiplier: multiplierList[myMultiplierSetting],
            currDist: {btc: btcVal, eth: ethVal},
          }
        });
        if (mlprUpdate || imgUpdate) {
          const userObj = {}
          Object.assign(
            userObj,
            {...res.data},
            {token: user.token},
          )
          this.props.updateUserData(userObj)
        }
      })
      .catch(err => {
        this.props.showFeedback(err, 'error')
      })
  }

  // This updates the data used to compare which functionality was updated and possibly fire one notification instead of 2
  updateCheckData = () => {
    const {invPause, multiplier, btc, eth} = this.state
    this.setState({
      checkDetails: {
        invPause,
        multiplier,
        currDist: {btc, eth},
      }
    });
  }

  toggle = tab => {
    if (tab !== this.state.activeTab) {
      this.setState({
        activeTab: tab,
      })
    }
  }

  /* start account settings functions */
  switchRoundup = e => {
    const {checked} = e.target
    const {user} = this.props
    this.setState({
      invPause: !checked,
      loadingRoundup: true,
    })
    const invStatus = {
      pause_investment: !checked,
    }
    callApi('/user/investment/status', invStatus, 'POST', user.token)
      .then(({data}) => {
        console.log(data)
        this.setState({
          loadingRoundup: false,
        })
        this.props.showFeedback('Round-up successfully updated', 'success')
      })
      .catch(() => {
        this.setState({
          loadingRoundup: false,
          invPause: checked,
        })
        this.props.showFeedback(
          'Error updating round-up. Please try again',
          'error',
        )
      })
  }

  selectMultiplier = e => {
    const {value} = e.target
    this.setState({
      multiplier: value,
    })
  }

  updateRatio = e => {
    const {name, value} = e.target
    if (value.length > 2 && value > 100) {
      this.props.showFeedback('Please enter valid amount', 'error')
      return false
    } else {
      if (name === 'btc') {
        this.setState(prevState => ({
          btc: parseInt(value, 10),
          eth: parseInt(100 - value, 10),
          checkDetails: {
            ...prevState.checkDetails,
            currDist: {              
              btc: parseInt(value, 10),
              eth: parseInt(100 - value, 10),
            }
          }
        })
      )}
      if (name === 'eth') {
        this.setState(prevState => ({
          btc: parseInt(100 - value, 10),
          eth: parseInt(value, 10),
          checkDetails: {
            ...prevState.checkDetails,
            currDist: {    
              btc: parseInt(100 - value, 10),
              eth: parseInt(value, 10),
            }
          }
        })
      )}
    }
  }

  saveDetails = async () => {
    const {multiplier, currDist, checkDetails} = this.state
    if (isEqual(multiplier, checkDetails.multiplier) && !isEqual(currDist, checkDetails.currDist)) {
      this.saveRatio()
    } else if (isEqual(currDist, checkDetails.currDist) && !isEqual(multiplier, checkDetails.multiplier)) {
      this.saveMultiplier()
    } else if (!isEqual(currDist, checkDetails.currDist) && !isEqual(multiplier, checkDetails.multiplier)) {
      await this.saveMultiplier()
      this.saveRatio()
    }
  }

  saveMultiplier = () => {
    // Check and submit only changed values
    const {multiplier} = this.state
    const {user} = this.props
    // console.log(user)
    const multiplierList = {1: '1', 2: '2', 3: '5', 4: '10'}
    const selectedMultiplierId = Object.keys(multiplierList).find(
      key => multiplierList[key] === String(parseInt(multiplier, 10)),
    )
    this.setState({
      loadingCoinDstrbn: true,
    })
    const multiplierObj = {multiplier: selectedMultiplierId}
    callApi('/user/multipliers', multiplierObj, 'POST', user.token)
      .then(() => {
        this.props.showFeedback('Multiplier successfully updated', 'success')
        // this.saveRatio()
        if (user.setup.multiplierSetup.done === false) {
          // Update percentage in left sidebar if multiplier is being set for the first time
          this.loadUserData(true)
        } else {
          this.loadUserData()
        }
        this.updateCheckData()
      })
      .catch(err => {
        console.log(err)
        this.props.showFeedback(
          'Error updating currency ratio, please try again',
        )
      })
      .finally(() => 
        this.setState({
          loadingCoinDstrbn: false,
        })
      )
  }

  saveRatio = () => {
    const {btc, eth} = this.state
    const {user} = this.props
    // Created temporarily
    const currArray = [
      {id: 2, percentage: btc},
      {id: 3, percentage: eth},
    ]
    this.setState({
      loadingCoinDstrbn: true,
    })
    const currObj = {currencies: currArray}
    callApi('/user/distributions', currObj, 'POST', user.token)
      .then(() => {
        this.props.showFeedback(
          'Currency ratio successfully updated',
          'success',
        )
        this.setState({
          currDist: {btc, eth},
        })
        this.updateCheckData()
      })
      .catch(() => {
        this.props.showFeedback(
          'Error updating currency ratio, please try again',
        )
      })
      .finally(() => 
        this.setState({
          loadingCoinDstrbn: false,
        })
      )
  }
  /* end account settings functions */

  /* start banks functions */
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
    // toggle selected object
    // const clearedList = accountsFSList.map(acc => ({...acc, fundingSource: false})) // find better solution
    const tempList = accountsFSList.map(acc => {
    // const tempList = clearedList.map(acc => {
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
        .catch(() => {
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
        this.setState({loadingAcctLink: false, accountModal: false});
        this.loadUserData()
      })
      .catch(() => {
        this.setState({loadingAcctLink: false});
        this.props.showFeedback('Error updating funding source', 'error')
      })
  }
  /* end banks functions */

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
    const {firstName, lastName, email, phone, dob, address, city, country, zipCode, referralUrl, multiplier, btc, eth, currDist, invPause, loadingRoundup, loadingCoinDstrbn, accounts, acctFundingSource, accountModal, bankAccountSetup, multiplierSetup, topup, documentUpload, documentUploadStatus, documentUploadError, total, notifications, twofactorAuth, activeTab, loadingAcctLink, image} = this.state
    const {user} = this.props

    return (
      <div>
      {this.renderRedirectToRoot()}
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
              image={image}
            />
          </Col>
          <Col md={9}>
            <div className="account-settings">
              <Row className="nav-container">
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
              <Row className="tab-container">
                <Col md={12}>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1" className="p-4">
                      <EditProfile 
                        firstName={firstName}
                        lastName={lastName}
                        email={email}
                        phone={phone}
                        dob={dob}
                        address={address}
                        city={city}
                        country={country}
                        zipCode={zipCode}
                        referralUrl={referralUrl}
                        loadUserData={this.loadUserData}
                        updateUserData={this.props.updateUserData}
                      />
                    </TabPane>
                    <TabPane tabId="2" className="p-4">
                      <AccountSettings 
                        multiplier={multiplier}
                        btc={btc}
                        eth={eth}
                        currDist={currDist}
                        invPause={invPause}
                        loadingRoundup={loadingRoundup}
                        loadingCoinDstrbn={loadingCoinDstrbn}
                        switchRoundup={this.switchRoundup}
                        selectMultiplier={this.selectMultiplier}
                        updateRatio={this.updateRatio}
                        saveDetails={this.saveDetails}
                        saveRatio={this.saveRatio}
                      />
                    </TabPane>
                    <TabPane tabId="3" className="p-4">
                      <BanksCards 
                        bankAccounts={accounts}
                        acctFundingSource={acctFundingSource}
                        accountsLinked={this.accountsLinked}
                        fundingSource={this.fundingSourceLinked}
                        loadingAcctLink={loadingAcctLink}
                        accountModal={accountModal}
                        connectSelectedAccts={this.connectSelectedAccts}
                        loadUserData={this.loadUserData}
                      />
                    </TabPane>
                    <TabPane tabId="4" className="p-4">
                      <Security user={user} twoFA={twofactorAuth} notifications={notifications} updateUserData={this.loadUserData} />
                    </TabPane>
                  </TabContent>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps, {showFeedback, updateUserData})(Account)

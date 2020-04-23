import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect, withRouter} from 'react-router-dom'
import PlaidLink from 'react-plaid-link'

import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
} from 'reactstrap'

import AccountList from '../../components/AccountList'
import RatioDistribution from '../../components/RatioDistribution'
import {callApi} from '../../helpers/api'
import {
  loginUser,
  showFeedback,
  showRightSidebar,
  hideRightSidebar,
} from '../../redux/actions'
import {isUserAuthenticated} from '../../helpers/authUtils'
import Loader from '../../components/Loader'
import AcctLinkLoader from '../../assets/images/spin-loader.gif'

class AccountConnect extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      accountModal: false,
      cardModal: false,
      invModal: false,
      accounts: [],
      accountsLinkedList: [],
      cards: [],
      cardsLinkedList: [],
      loadingAccts: true,
      loadingAcctLink: false,
      loadingCards: true,
      loadingDstrbn: false,
      btc: 50,
      eth: 50,
    }
  }

  componentDidMount() {
    this._isMounted = true
    document.body.classList.add('authentication-bg')
    this.props.showRightSidebar()
    this.props.hideRightSidebar()
  }

  componentWillUnmount() {
    this._isMounted = false
    document.body.classList.remove('authentication-bg')
  }

  toggle = () => {
    const {accountModal} = this.state
    this.setState({
      accountModal: !accountModal,
    })
  }

  handleOnSuccess = (token, metadata) => {
    console.log(token)
    console.log(metadata)
    const {user} = this.props
    this.setState({
      accountModal: true,
    })
    const institution_name = metadata.institution.name
    const {institution_id} = metadata.institution
    const {public_token} = metadata
    const linkObj = {institution_name, institution_id, public_token}
    callApi('/user/plaid/bank', linkObj, 'POST', user.token)
      .then(res => {
        const accountsModList = res.data.accounts.map(acc => {
          acc.link = acc.accountLink
          acc.fundingSource = acc.accountFundingSource
          return acc
        })
        // Deep copy is the best option
        const accountList = JSON.parse(JSON.stringify(res.data.accounts))
        const accountsLinkedList = accountList.map(acc => {
          Object.keys(acc).forEach(key => key !== 'id' && delete acc[key])
          acc.link = true
          return acc
        })
        const fsList = JSON.parse(JSON.stringify(res.data.accounts))
        const accountsFSArr = fsList.map(acc => {
          Object.keys(acc).forEach(key => key !== 'id' && delete acc[key])
          acc.fundingSource = false
          return acc
        })
        // const accountsFSArr = JSON.parse(JSON.stringify(fsList)).map(acctDet => {
        //   Object.keys(acctDet).forEach(key => (key !== 'id' && key !== 'fundingSource') && delete acctDet[key])
        //   return acctDet
        // })
        this.setState({
          accounts: accountsModList,
          accountsLinkedList,
          accountsFSList: accountsFSArr,
          loadingAccts: false,
        })
      })
      .catch(err => {
        console.log(err)
        this.props.showFeedback('Error linking bank, please try again', 'error')
        this.setState({loadingAccts: false})
      })
  }

  handleOnExit = () => {
    // handle the case when your user exits Link
    this.props.showFeedback('Exited Plaid account linking', 'error')
  }

  accountsLinked = (id, val) => {
    // console.log(id, val)
    const {accountsLinkedList} = this.state
    const tempList = accountsLinkedList.map(acc => {
      if (acc.id === id) {
        return {...acc, link: val}
      }
      return acc
    })
    const noLinkedAccts = tempList.filter(acct => acct.link === true)
    this.setState({
      accountsLinkedList: tempList,
      disableConnectBtn: !Boolean(noLinkedAccts.length),
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
    const {accountsLinkedList, accountsFSList} = this.state
    const {user} = this.props
    const accountsObj = {accounts_link: accountsLinkedList}
    // Check if single funding source
    const filteredFS = accountsFSList.filter(fs => fs.fundingSource === true)
    if (filteredFS.length === 1) {
      this.setState({loadingAcctLink: false})
      callApi('/user/plaid/bank/account/link', accountsObj, 'POST', user.token)
        .then(() => {
          this.props.showFeedback('Account(s) successfully linked', 'success')
          this.connectFundingSource(filteredFS[0])
        })
        .catch(err => {
          console.log(err)
          this.props.showFeedback('Error linking account(s)', 'error')
        })
    } else {
      this.props.showFeedback('Please specify only one funding source', 'error')
    }
  }

  connectFundingSource = val => {
    const {user} = this.props
    const fsObj = {funding_source: val.fundingSource, bank_account_id: val.id}
    callApi(
      '/user/plaid/bank/account/funding/source',
      fsObj,
      'POST',
      user.token,
    )
      .then(() => {
        this.props.showFeedback(
          'Funding source successfully updated',
          'success',
        )
        this.setState({loadingAcctLink: false})
        this.setState({
          accountModal: false,
          invModal: true,
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({loadingAcctLink: false})
        this.props.showFeedback('Error updating funding source', 'error')
      })
  }

  updateRatio = e => {
    const {name, value} = e.target
    if (value.length > 2 && value > 100) {
      this.props.showFeedback('Please enter valid amount', 'error')
      return false
    } else {
      if (name === 'btc') {
        this.setState({
          btc: parseInt(value, 10),
          eth: parseInt(100 - value, 10),
        })
      } else {
        this.setState({
          btc: parseInt(100 - value, 10),
          eth: parseInt(value, 10),
        })
      }
    }
  }

  saveRatio = () => {
    const {btc, eth} = this.state
    const {user} = this.props
    this.setState({loadingDstrbn: true})
    // Created temporarily
    const currArray = [
      {id: 2, percentage: btc},
      {id: 3, percentage: eth},
    ]
    const currObj = {currencies: currArray}
    callApi('/user/distributions', currObj, 'POST', user.token)
      .then(() => {
        this.props.showFeedback(
          'Currency ratio successfully updated',
          'success',
        )
        this.setState({
          loadingDstrbn: false,
        })
        this.props.history.push('/dashboard')
      })
      .catch(() => {
        this.props.showFeedback(
          'Error updating currency ratio, please try again',
          'error',
        )
        this.setState({
          loadingDstrbn: false,
        })
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
  // eslint-disable-next-line max-lines-per-function
  render() {
    const isAuthTokenValid = isUserAuthenticated()
    const {user} = this.props
    const {
      accounts,
      accountModal,
      invModal,
      disableConnectBtn,
      loadingAccts,
      loadingDstrbn,
      loadingAcctLink,
      btc,
      eth,
    } = this.state

    const accountList = accounts.map(acc => (
      <AccountList
        key={acc.id}
        details={acc}
        accountsLinked={this.accountsLinked}
        fundingSource={this.fundingSourceLinked}
      />
    ))

    return (
      <Fragment>
        {/*this.renderRedirectToRoot()*/}

        {(this._isMounted || !isAuthTokenValid) && (
          <div className="account-pages mt-5 mb-5">
            <Container>
              <Row className="justify-content-center">
                <Col xl={12}>
                  <Row>
                    <Col md={6} className="d-none d-md-inline-block">
                      <div className="auth-page-sidebar">
                        <div className="auth-user-testimonial">
                          <p className="lead font-weight-bold">Funding</p>
                          <p className="font-size-24 font-weight-bold mb-1">
                            Connect your bank account
                          </p>
                        </div>
                      </div>
                      <div className="overlay signup-bg"></div>
                    </Col>
                    <Col md={6} className="position-relative">
                      {/* preloader */}
                      {this.props.loading && <Loader />}

                      <div className="auth-page-sidebar">
                        <div className="overlay"></div>
                        <div className="auth-user-testimonial">
                          <p className="verify-info font-weight-bold text-muted mb-0">
                            This bank account will be used for your weekly
                            round-up deposits, one-time investments,
                          </p>
                          <p className="verify-info font-weight-bold text-muted mb-0">
                            and is the destination for your funds withdrawals.
                            Please read the Avenir debit authorization
                          </p>
                          <p className="verify-info font-weight-bold text-muted mb-0">
                            and $5 processing fee below.
                          </p>
                        </div>
                      </div>
                      <div className="bank-verify-info mt-4 p-3">
                        <p className="mb-0">
                          I, {user && user.myFirstName ? user.myFirstName : ''},
                          authorize Avenir Inc. to debit the account indicated
                          for the recurring transactions according to the terms
                          of use and my agreement with Avenir Inc. I will not
                          dispute Avenir Inc. so long as the transactions
                          correspond to the terms of use and my agreement with
                          Avenir Inc.
                        </p>
                        <p className="mb-0 mt-4">
                          This payment authorization is valid and will remain
                          effective unless I cancel this authorization by
                          unlinking my bank account on my settings page before
                          your round-up milestone is completed. I will not
                          dispute Avenir Inc. so long as the transactions
                          correspond to the terms of use and my agreement with
                          Avenir Inc. This payment authorization is valid and
                          will remain effective unless I cancel this
                          authorization.
                        </p>
                      </div>
                      <div className="mt-3">
                        <PlaidLink
                          clientName="Avenir app"
                          env="sandbox"
                          // env="production"
                          product={['auth', 'transactions']}
                          publicKey="3c3d222fa56168931abed2dc785bc2"
                          onExit={this.handleOnExit}
                          onSuccess={this.handleOnSuccess}
                          className="btn btn-blue btn-block btn-plaid"
                        >
                          Connect my Funding Account
                        </PlaidLink>
                      </div>
                      <Modal isOpen={accountModal} toggle={this.toggle} size="lg" centered>
                        <ModalHeader>Select accounts to be linked</ModalHeader>
                        <ModalBody>
                          {loadingAccts ? (
                            <Loader />
                          ) : accountList && accountList.length ? (
                            <div>
                              <h4 className="text-center">
                                Your account is now linked to Avenir. You can
                                unlink an account by clicking on it.
                              </h4>
                              {accountList}
                            </div>
                          ) : (
                            'Oops, no accounts found for selected bank'
                          )}
                          {loadingAcctLink ? (
                            <img
                              src={AcctLinkLoader}
                              alt="loader"
                              style={{height: '40px', marginTop: '20px'}}
                            />
                          ) : (
                            <Button
                              color="success"
                              block
                              onClick={this.connectSelectedAccts}
                              disabled={disableConnectBtn}
                            >
                              Continue
                            </Button>
                          )}
                        </ModalBody>
                      </Modal>

                      <Modal isOpen={invModal} size="lg" centered>
                        <ModalBody>
                          <RatioDistribution
                            btc={btc}
                            eth={eth}
                            updateRatio={this.updateRatio}
                            saveRatio={this.saveRatio}
                            loadingDstrbn={loadingDstrbn}
                          />
                        </ModalBody>
                      </Modal>

                      {this.props.error && (
                        <Alert
                          color="danger"
                          isOpen={typeof this.props.error === 'object'}
                        >
                          <div>
                            {this.props.error.message === 'Network Error'
                              ? 'Network Error. Please check your internet connection'
                              : this.props.error.message}
                          </div>
                        </Alert>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  const {user, error} = state.Auth
  return {user, error}
}

export default connect(mapStateToProps, {
  loginUser,
  showFeedback,
  showRightSidebar,
  hideRightSidebar,
})(withRouter(AccountConnect))

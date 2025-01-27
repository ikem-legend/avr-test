import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap'
import PlaidLink from 'react-plaid-link'
import AccountList from '../../components/AccountList'
import FundingSourceList from '../../components/FundingSourceList'
import UserFundingSource from '../../components/UserFundingSource'
import Loader from '../../components/Loader'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'
import AcctLinkLoader from '../../assets/images/spin-loader.gif'

class BanksCards extends Component {
  constructor() {
    super()
    this.state = {
      accounts: [],
      loadingAccts: false,
      accountModal: false,
      disableConnectBtn: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.accountModal !== this.props.accountModal) {
      this.updateModalState()
    }
  }

  /**
   * Update local Modal state
   */
  updateModalState = () => {
    const {accountModal} = this.props
    this.setState({accountModal})
  }

  /**
   * Handle Successful Plaid link
   * @param {string} token Public token
   * @param {object} metadata Metadata object
   */
  handleOnSuccess = (token, metadata) => {
    const {user} = this.props
    this.setState({
      accountModal: true,
      loadingAccts: true,
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
        this.setState({
          accounts: accountsModList,
          loadingAccts: false,
        })
      })
      .catch(() => {
        this.props.showFeedback('Error linking bank, please try again', 'error')
        this.setState({loadingAccts: false})
      })
  }

  /**
   * Handle Plaid Link exit
   */
  handleOnExit = () => {
    this.props.showFeedback('Cancelled bank account linking', 'error')
  }

  /**
   * Set funding source via API
   * @param {object} val Funding source details
   */
  connectFundingSource = val => {
    const {user, loadUserData} = this.props
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
        loadUserData()
        this.setState({
          accountModal: false,
        })
      })
      .catch(() => {
        this.props.showFeedback('Error updating funding source', 'error')
      })
  }

  /**
   * Cancel account link
   */
  exitAccountLink = () => {
    this.setState({
      accountModal: false,
    })
  }

  render() {
    const {
      bankAccounts,
      acctFundingSource,
      accountsLinked,
      fundingSource,
      connectSelectedAccts,
      loadingAcctLink,
    } = this.props
    const {accounts, accountModal, loadingAccts, disableConnectBtn} = this.state
    const acctList =
      bankAccounts &&
      bankAccounts.map(acct => (
        <Card key={acct.institutionId}>
          <CardBody className="px-2">
            <Row>
              <Col md={9} className="font-weight-bold acct-name">
                {acct.institutionName}
              </Col>
              <Col md={3}>Choose your funding source</Col>
              <Col md={12}>
                {acct.accounts.map(acctDetail => (
                  <FundingSourceList
                    key={`${acct.institutionId}-${acctDetail.id}`}
                    acct={acct}
                    acctDetail={acctDetail}
                    accountsLinked={accountsLinked}
                    fundingSource={fundingSource}
                  />
                ))}
              </Col>
            </Row>
          </CardBody>
        </Card>
      ))

    const accountList =
      accounts &&
      accounts.map(acc => (
        <AccountList
          details={acc}
          key={acc.id}
          accountsLinked={accountsLinked}
          fundingSource={fundingSource}
        />
      ))

    // const userFundingSource = acctFundingSource && acctFundingSource.map(fs => (
    const userFundingSource =
      acctFundingSource && Object.keys(acctFundingSource).length ? (
        <UserFundingSource fs={acctFundingSource} />
      ) : null

    return (
      <Fragment>
        <Row>
          <Col md={8}>
            <h5>Funding Source (Bank Account & Credit Card)</h5>
          </Col>
          <Col md={4}>
            <PlaidLink
              clientName="Avenir app"
              // env="sandbox"
              env="production"
              product={['auth', 'transactions']}
              publicKey="3c3d222fa56168931abed2dc785bc2"
              onExit={this.handleOnExit}
              onSuccess={this.handleOnSuccess}
              className="btn btn-blue btn-block btn-plaid"
            >
              Link Bank Account
            </PlaidLink>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="mb-2">
            <p className="font-weight-bold mb-0">
              Connect your Bank Account and credit or debit card. We will use
              this bank account for your weekly{' '}
            </p>
            <p className="font-weight-bold mb-0">
              round-ups deposits, one-time investments and the destination for
              your withdrawals.{' '}
            </p>
            <p className="font-weight-bold mb-0">
              Please acknowledge the Avenir debit authorization and a $1
              processing fee
            </p>
          </Col>
        </Row>
        <Row className="mb-2 h-100">
          <Col md={12}>{userFundingSource}</Col>
        </Row>
        <Row>
          <Col md={12}>
            {acctList}
            <Row>
              <Col md={{size: 2, offset: 10}}>
                {loadingAcctLink ? (
                  <img
                    src={AcctLinkLoader}
                    alt="loader"
                    style={{height: '40px', marginTop: '20px'}}
                  />
                ) : (
                  <Button block onClick={connectSelectedAccts} color="red">
                    Save
                  </Button>
                )}
              </Col>
            </Row>
          </Col>
          <Modal isOpen={accountModal} toggle={this.toggle} size="lg" centered>
            <ModalHeader className="account-link-header mx-auto">
              Link Connected Accounts
            </ModalHeader>
            <ModalBody className="pt-0">
              {loadingAccts ? (
                <Loader />
              ) : accountList && accountList.length ? (
                <div>
                  <p className="text-center mt-0 mb-0">
                    Your account is now linked to Avenir. Tick a box to choose
                    your{' '}
                    <span className="font-weight-bold">Funding Source</span>.
                  </p>
                  <p>
                    You can unlink an account by clicking on the{' '}
                    <span className="font-weight-bold">Linked</span> button.
                  </p>
                  {accountList}
                </div>
              ) : (
                <p className="text-center">
                  Oops, no accounts found for selected bank
                </p>
              )}
              <Button
                color="success"
                block
                onClick={connectSelectedAccts}
                disabled={disableConnectBtn}
              >
                Continue
              </Button>
              <Button color="danger" block onClick={this.exitAccountLink}>
                Cancel
              </Button>
            </ModalBody>
          </Modal>
        </Row>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps, {showFeedback})(BanksCards)

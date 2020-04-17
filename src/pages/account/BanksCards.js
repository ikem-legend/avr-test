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
// import classnames from 'classnames'
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
      accountsLinkedList: [],
      accountsFSList: [],
      loadingAccts: false,
      accountModal: false,
      disableConnectBtn: false,
    }
  }

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
        this.setState({
          accounts: accountsModList,
          // accounts: res.data.accounts,
          accountsLinkedList,
          accountsFSList: accountsFSArr,
          loadingAccts: false,
        })
      })
      .catch(() => {
        this.props.showFeedback('Error linking bank, please try again', 'error')
        this.setState({loadingAccts: false})
      })
  }

  handleOnExit = () => {
    // handle the case when your user exits Link
    this.props.showFeedback('Exited Plaid account linking', 'error')
  }

  accountsLinked = (id, val) => {
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

  // Rework to parent component
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

  // Rework to parent component
  connectSelectedAccts = () => {
    const {accountsLinkedList} = this.state
    const {user, loadUserData} = this.props
    const accountsObj = {accounts_link: accountsLinkedList}
    callApi('/user/plaid/bank/account/link', accountsObj, 'POST', user.token)
      .then(() => {
        this.props.showFeedback('Account(s) successfully linked', 'success')
        loadUserData()
        this.setState({
          accountModal: false,
        })
      })
      .catch(() => {
        this.props.showFeedback('Error linking account(s)', 'error')
      })
  }

  connectSelectedAccts = () => {
    const {accountsLinkedList, accountsFSList} = this.state
    const {user} = this.props
    const accountsObj = {accounts_link: accountsLinkedList}
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
    const {user, loadUserData} = this.props
    const fsObj = {funding_source: val.fundingSource, bank_account_id: val.id}
    callApi('/user/plaid/bank/account/funding/source', fsObj, 'POST', user.token)
      .then(() => {
        this.props.showFeedback('Funding source successfully updated', 'success')
        loadUserData()
        this.setState({
          loadingAcctLink: false,
          accountModal: false,
        });
      })
      .catch(err => {
        console.log(err)
        this.setState({loadingAcctLink: false});
        this.props.showFeedback('Error updating funding source', 'error')
      })
  }

  exitAccountLink = () => {
    // Possibly unlink/deactivate selected bank
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
          <CardBody>
            <Row>
              <Col md={12} className="font-weight-bold acct-name">
                {acct.institutionName}
              </Col>
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
          accountsLinked={this.accountsLinked}
          fundingSource={this.fundingSourceLinked}
        />
      ))

    // const userFundingSource = acctFundingSource && acctFundingSource.map(fs => (
    const userFundingSource = acctFundingSource && Object.keys(acctFundingSource).length ? (
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
        <Row>
          <Col md={12}>
            {userFundingSource}
          </Col>
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
          <Modal isOpen={accountModal} toggle={this.toggle} size="lg">
            <ModalHeader>Select accounts to be linked</ModalHeader>
            <ModalBody>
              {loadingAccts ? (
                <Loader />
              ) : accountList && accountList.length ? (
                <div>
                  <h4 className="text-center">
                    Your account is now linked to Avenir. You can unlink an
                    account by clicking on it.
                  </h4>
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
                onClick={this.connectSelectedAccts}
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

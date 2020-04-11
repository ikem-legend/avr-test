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
      loadingAccts: false,
      accountModal: false,
		}
	}

  // componentDidUpdate(prevProps) {
  //   if (prevProps.bankAccounts.length < this.props.bankAccounts.length) {
  //     const accountsLinkedList = this.props.bankAccounts.map(acc => {
  //       acc.accounts.map(details => {
  //         details.link = true
  //         return details
  //       })
  //       return acc
  //       // Object.keys(acc).forEach(key => key !== 'id' && delete acc[key])
  //     })
  //     console.log(accountsLinkedList)
  //   }
  // }
  
  displayAccountList = () => {
    const {accounts} = this.state
    const accountList = accounts.map(acc => (
      <AccountList
        details={acc}
        key={acc.id}
        accountsLinked={this.accountsLinked}
      />
    ))
    return accountList
  }

  handleOnSuccess = (token, metadata) => {
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
        // Deep copy is the best option
        const accountList = JSON.parse(JSON.stringify(res.data.accounts))
        const accountsLinkedList = accountList.map(acc => {
          Object.keys(acc).forEach(key => key !== 'id' && delete acc[key])
          acc.link = true
          return acc
        })
        this.setState({
          accounts: res.data.accounts,
          accountsLinkedList,
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

  connectSelectedAccts = () => {
    const {accountsLinkedList} = this.state
    const {user} = this.props
    const accountsObj = {accounts_link: accountsLinkedList}
    callApi('/user/plaid/bank/account/link', accountsObj, 'POST', user.token)
      .then(() => {
        this.props.showFeedback('Account(s) successfully linked', 'success')
        this.displayCards()
      })
      .catch(() => {
        this.props.showFeedback('Error linking account(s)', 'error')
      })
  }

	render() {
    const {bankAccounts, accountsLinked, connectSelectedAccts, loadingAcctLink} = this.props
    const {
      accountModal,
      loadingAccts,
    } = this.state
    const acctList = bankAccounts && bankAccounts.map(acct => (
      <Card key={acct.id}>
        <CardBody>
          <Row>
            <Col md={12} className="font-weight-bold acct-name">
              {acct.institutionName}
            </Col>
            <Col md={12}>
              {
                acct.accounts.map(acctDetail => (
                  <FundingSourceList
                    key={`${acct.institutionId}-${acctDetail.id}`}
                    acct={acct}
                    acctDetail={acctDetail}
                    accountsLinked={accountsLinked}
                  />
                ))
              }
            </Col>
          </Row>
        </CardBody>
      </Card>
    ))
		return (
      <Fragment>
        <Row>
          <Col md={8}>
            <h5>Funding Source (Bank Account & Credit Card)</h5>
          </Col>
          <Col md={4}>
            <PlaidLink
              clientName="Avenir app"
              env="sandbox"
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
                  <Button block onClick={connectSelectedAccts} color="red">Save</Button>
                )}
              </Col>
            </Row>
          </Col>
          <Modal isOpen={accountModal} toggle={this.toggle}>
            <ModalHeader>Select accounts to be linked</ModalHeader>
            <ModalBody>
              {loadingAccts ? <Loader /> : null}
              {this.displayAccountList && this.displayAccountList.length ? (
                // {accountList && accountList.length ? (
                <div>
                  <h4 className="text-center">
                    Your account is now linked to Avenir. You can unlink an
                    account by clicking on it.
                  </h4>
                  {this.displayAccountList}
                </div>
              ) : (
                'Oops, no accounts found for selected bank'
              )}
              <Button color="success" block onClick={this.connectSelectedAccts}>
                Continue
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

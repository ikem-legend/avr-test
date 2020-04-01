import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap'
import PlaidLink from 'react-plaid-link'
import AccountList from '../../components/AccountList'
import CardList from '../../components/CardList'
import Loader from '../../components/Loader'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'

class BanksCards extends Component {
	constructor() {
		super()
		this.state = {
      accounts: [],
			cards: [],
      accountsLinkedList: [],
      loadingAccts: false,
      loadingCards: false,
      accountModal: false,
      cardModal: false,
		}
	}
  
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
  
  displayCardsList = () => {
    const {cards} = this.state
    const accountList = cards.map(acc => (
      <CardList
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
        // console.log(accountsLinkedList)
        this.setState({
          accounts: res.data.accounts,
          accountsLinkedList,
          loadingAccts: false,
        })
      })
      .catch(err => {
        console.log(err)
        this.props.showFeedback('Error linking bank, please try again', 'error')
        this.setState({loadingAccts: false});
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
      .catch(err => {
        console.log(err)
        this.props.showFeedback('Error linking account(s)', 'error')
      })
  }

  displayCards = () => {
    const {user} = this.props
    this.setState({
      accountModal: false,
      cardModal: true,
    })
    callApi('/user/plaid/bank/get/cards', null, 'GET', user.token)
      .then(res => {
        const cardList = JSON.parse(JSON.stringify(res.data))
        const cardsLinkedList = cardList.map(card => {
          Object.keys(card).forEach(key => key !== 'id' && delete card[key])
          card.link = true
          return card
        })
        this.setState({
          cards: res.data,
          cardsLinkedList,
          loadingCards: false,
        })
      })
      .catch(() => {
        this.props.showFeedback(
          'Error displaying card(s), contact your banking for details',
          'error',
        )
        this.setState({
          loadingCards: false,
        })
      })
  }

  connectSelectedCards = () => {
    const {cardsLinkedList} = this.state
    const {user} = this.props
    const cardsObj = {accounts_link: cardsLinkedList}
    callApi('/user/plaid/bank/account/link', cardsObj, 'POST', user.token)
      .then(() => {
        this.props.showFeedback('Card(s) successfully linked', 'success')
        this.setState({
          cardModal: false
        });
      })
      .catch(err => {
        console.log(err)
        this.props.showFeedback('Error linking card(s)', 'error')
      })
  }

	render() {
    // const {bankAccounts} = this.props
    const {
      accountModal,
      loadingAccts,
      cardModal,
      loadingCards,
    } = this.state
    // console.log(bankAccounts)
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
            <p className="font-weight-bold mb-0">Connect your Bank Account and credit or debit card. We will use this bank account for your weekly </p>
            <p className="font-weight-bold mb-0">round-ups deposits, one-time investments and the destination for your withdrawals. </p>
            <p className="font-weight-bold mb-0">Please acknowledge the Avenir debit authorization and a $1 processing fee</p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
          </Col>
          <Modal isOpen={accountModal} toggle={this.toggle}>
            <ModalHeader>Select accounts to be linked</ModalHeader>
            <ModalBody>
              {loadingAccts ? <Loader /> : null}
              {this.displayAccountList && this.displayAccountList.length ? (
              // {accountList && accountList.length ? (
                <div>
                  <h4 className="text-center">
                    Your account is now linked to Avenir. You can
                    unlink an account by clicking on it.
                  </h4>
                  {this.displayAccountList}
                </div>
              ) : (
                'Oops, no accounts found for selected bank'
              )}
              <Button
                color="success"
                block
                onClick={this.connectSelectedAccts}
              >
                Continue
              </Button>
            </ModalBody>
          </Modal>
        </Row>
        <Row>
          <Col md={12}>
            <h5>Round-up Cards (Credit & Debit)</h5>
          </Col>
        </Row>
        <Row form>
          <Col md={12}>
            <p className="font-weight-bold mb-0">Connect your credit or debit card to boost your round-up investing</p>
          </Col>
          <Modal isOpen={cardModal} toggle={this.toggle}>
            <ModalHeader>Select cards to be linked</ModalHeader>
            <ModalBody>
              {loadingCards ? <Loader /> : null}
              {this.displayCardsList && this.displayCardsList.length ? (
                <div>
                  <h4 className="text-center">
                    Your card is now linked to Avenir. You can
                    unlink an card by clicking on it.
                  </h4>
                  {this.displayCardsList}
                </div>
              ) : (
                'Oops, no cards found for selected bank'
              )}
              <Button
                color="success"
                block
                onClick={this.connectSelectedCards}
              >
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
	user: state.Auth.user
})

export default connect(mapStateToProps, {showFeedback})(BanksCards)
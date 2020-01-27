import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect, Link} from 'react-router-dom'
import PlaidLink from 'react-plaid-link'

import {Container, Row, Col, Button, Modal, ModalHeader, ModalBody, Alert} from 'reactstrap'

import AccountList from '../../components/AccountList'
import {callApi} from '../../helpers/api'
import {registerUser} from '../../redux/actions'
import {isUserAuthenticated} from '../../helpers/authUtils'
import Loader from '../../components/Loader'
// import logo from '../../assets/images/logo.png';

class AccountConnect extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      accountModal: false,
      accounts: [],
      accountsLinkedList: [],
      disableConnectBtn: true
    }
    this.handleValidSubmit = this.handleValidSubmit.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
    document.body.classList.add('authentication-bg')
    const {firstname, lastname} = this.state
    // Another possible solution is to use an array to loop through the state then update field styling
    if (firstname && lastname) {
      document.querySelectorAll('.float-container').classList.add('active')
    }
    
    const {accountsLinkedList} = this.state
    const noLinkedAccts = accountsLinkedList.filter(acct => (
      acct.value === false
    ))
    // console.log(noLinkedAccts)
    this.setState({
      disableConnectBtn: noLinkedAccts.length ? true : false
    });
    // await callApi('/data/countries', null, 'GET')
    //   .then(response => {
    //     // console.log(response)
    //     const countryList = response.data.map(coun => ({
    //       value: coun.id,
    //       label: coun.name,
    //     }))
    //     const cityArray = response.data.map(coun =>
    //       coun.cities.map(city => ({value: city.id, label: city.name})),
    //     )
    //     const cityList = [].concat(...cityArray)
    //     // console.log(cityList)
    //     this.setState({
    //       cities: cityList,
    //       countries: countryList,
    //     })
    //   })
    //   .catch(err => console.log(err))

    // Commented temporarily
    // const user = JSON.parse(localStorage.getItem('avenir'))
    // // console.log(user.myFirstName)
    // this.setState({
    //   name: user.myFirstName,
    // })
  }

  componentWillUnmount() {
    this._isMounted = false
    document.body.classList.remove('authentication-bg')
    // Ensure that you can navigate to other auth parts by removing localStorage user details
    localStorage.removeItem('avenir')
  }

  /**
   * Handles the submit
   * @param {object} event The event object
   * @param {object} values Values to be submitted
   */
  handleValidSubmit = () => {
    // console.log(event, values)
    // console.log(this.state.inputs)
    const data = {...this.state.inputs}
    const {history} = this.props
    data.ssn = data.ssn.replace(/-/g, '')
    data.dob = String(data.dob)
    data.first_name = String(data.firstname)
    data.last_name = String(data.lastname)
    data.zip_code = String(data.zipcode)
    data.city_id = String(data.city.value)
    data.country_id = String(data.country.value)
    Object.keys(data).forEach(
      key =>
        (key === 'firstname' ||
          key === 'lastname' ||
          key === 'zipcode' ||
          key === 'city' ||
          key === 'country') &&
        delete data[key]
    )
    // console.log(data)
    this.props.registerUser(data, history)
  }

  activateField = e => {
    // console.log(e.target.name)
    document
      .querySelector(`.float-container #${e.target.name}`)
      .parentElement.classList.add('active')
    document.querySelector(
      `.float-container #${e.target.name}`,
    ).parentElement.style.borderLeft = '2px solid #1ca4a9'
  }

  deactivateField = e => {
    // console.log(e.target.name)
    document.querySelector(
      `.float-container #${e.target.name}`,
    ).parentElement.style.borderLeft = '1px solid #ccc'
    if (e.target.value === '') {
      // console.log(e.target.name)
      document
        .querySelector(`.float-container #${e.target.name}`)
        .parentElement.classList.remove('active')
    }
  }

  updateInputValue = e => {
    // console.log(e.target)
    e.preventDefault()
    const {name, value} = e.target
    // console.log(name, value)
    this.setState(prevState => ({
      ...prevState,
      inputs: {
        ...prevState.inputs,
        [name]: value,
      },
    }))
    // this.activateField(e);
  }

  updateTerms = e => {
    const {checked} = e.target
    // console.log(checked)
    this.setState({
      terms: checked,
    })
  }

  toggle = () => {
    const {accountModal} = this.state
    // console.log(accountModal)
    this.setState({
      accountModal: !accountModal,
    })
  }

  handleOnSuccess = (token, metadata) => {
    const {user} = this.props
    // send token to client server
    // console.log(token)
    // console.log(metadata)
    const institution_name = metadata.institution.name
    const {institution_id} = metadata.institution
    const {public_token} = metadata
    const linkObj = {institution_name, institution_id, public_token}
    console.log(linkObj)
    callApi('/user/plaid/bank', linkObj, 'POST', user.token)
      .then(res => {
        console.log(res)
      })
      .catch(err => console.log(err))
    // Deep copy is the best option
    const accountList = JSON.parse(JSON.stringify(metadata))
    const accountsLinkedList = accountList.accounts.map(acc => {
      Object.keys(acc).forEach(key => 
        (key !== 'id') && delete acc[key]
      )
      acc.value = false
      return acc
    })
    // console.log(accountsLinkedList)
    this.setState({
      accountModal: true,
      accounts: metadata.accounts,
      accountsLinkedList
    });
  }
  
  handleOnExit = () => {
    // handle the case when your user exits Link
    console.log('Exited')
  }

  accountsLinked = (id, val) => {
    // console.log(id, val)
    const {accountsLinkedList} = this.state
    // console.log(user)
    // const tempList = {...accountsLinkedList}
    const tempList = accountsLinkedList.map(acc => {
      if (acc.id === id) {
        return {...acc, value: val}
      }
      return acc
    })
    console.log(tempList)
    this.setState({
      accountsLinkedList: tempList
    });
  }

  connectSelectedAccts = () => {
    const {accountsLinkedList} = this.state
    const {user} = this.props
    const accountsObj = {accounts_link: accountsLinkedList}
    callApi('/user/plaid/bank/account/link', accountsObj, 'POST', user.token)
      .then(response => {
        console.log(response)
      })
      .catch(err => console.log(err))
  }

  /**
   * Redirect to root
   * @returns {object} Redirect component
   */
  // Commented temporarily
  renderRedirectToRoot = () => {
    // const isAuthTokenValid = isUserAuthenticated()
    // const userInStorage = localStorage.getItem('avenir')
    // if (!isAuthTokenValid && userInStorage) {
    //   return false
    // }
    // if (!isAuthTokenValid) {
    //   return <Redirect to="/account/login" />
    // }
  }

  render() {
    const isAuthTokenValid = isUserAuthenticated()
    const {name, accounts, accountModal, disableConnectBtn} = this.state

    const accountList = accounts.map(acc => (
      <AccountList details={acc} key={acc.id} accountsLinked={this.accountsLinked} />
    ))
    return (
      <Fragment>
        {this.renderRedirectToRoot()}

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
                          I, {name ? name : ''}, authorize Avenir Inc. to debit
                          the account indicated for the recurring transactions
                          according to the terms of use and my agreement with
                          Avenir Inc. I will not dispute Avenir Inc. so long as
                          the transactions correspond to the terms of use and my
                          agreement with Avenir Inc.
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
                          product={['auth', 'transactions']}
                          publicKey="3c3d222fa56168931abed2dc785bc2"
                          onExit={this.handleOnExit}
                          onSuccess={this.handleOnSuccess}
                          className="btn btn-blue btn-block btn-plaid"
                        >
                          Connect my Funding Account
                        </PlaidLink>
                      </div>
                      <div className="mt-3">
                        <Link to="/dashboard">
                          <Button color="transp" className="float-right">
                            Skip Round-Up Settings for now
                          </Button>
                        </Link>
                      </div>
                      <Modal isOpen={accountModal} toggle={this.toggle}>
                        <ModalHeader>Select accounts to be linked</ModalHeader>
                        <ModalBody>
                          <h4>Your account is now linked to Avenir. You can unlink an account by clicking on it.</h4>
                          {accountList}
                          <Button color="success" block onClick={this.connectSelectedAccts} disabled={disableConnectBtn}>Continue</Button>
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
  const {user, loading, error} = state.Auth
  return {user, loading, error}
}

// export default connect(null, {registerUser})(AccountConnect)
export default connect(mapStateToProps, {registerUser})(AccountConnect)

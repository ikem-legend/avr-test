import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect, Link} from 'react-router-dom'

import {
  Container,
  Row,
  Col,
  Label,
  FormGroup,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap'
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback,
} from 'availity-reactstrap-validation'

import {isUserAuthenticated} from '../../helpers/authUtils'
import Loader from '../../components/Loader'

class ForgotPassword extends Component {
  _isMounted = false

  constructor(props) {
    super(props)

    this.handleValidSubmit = this.handleValidSubmit.bind(this)
    this.state = {
      email: '',
      password: '',
    }
  }

  componentDidMount() {
    this._isMounted = true

    document.body.classList.add('authentication-bg')
    const {email, password} = this.state
    // Another possible solution is to use an array to loop through the state then update field styling
    if (email && password) {
      document.querySelectorAll('.float-container').classList.add('active')
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    document.body.classList.remove('authentication-bg')
  }

  /**
   * Handles the submit
   * @param {object} event Global event object
   * @param {object} values Form values
   */
  handleValidSubmit = (event, values) => {
    this.props.loginUser(values.email, this.props.history)
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
    e.preventDefault()
    const {name, value} = e.target
    this.setState({
      [name]: value,
    })
    // this.activateField(e);
  }

  togglePrivacy = () => {
    const {privacyModal} = this.state
    this.setState({
      privacyModal: !privacyModal
    });
  }

  toggleTerms = () => {
    const {termsModal} = this.state
    this.setState({
      termsModal: !termsModal
    });
  }

  /**
   * Redirect to root
   * @returns {object} Redirect component
   */
  renderRedirectToRoot = () => {
    const isAuthTokenValid = isUserAuthenticated()
    if (isAuthTokenValid) {
      return <Redirect to="/" />
    }
  }

  render() {
    const isAuthTokenValid = isUserAuthenticated()
    const {privacyModal, termsModal} = this.state
    return (
      <Fragment>
        {this.renderRedirectToRoot()}

        {(this._isMounted || !isAuthTokenValid) && (
          <div className="account-pages">
            <Container fluid={true}>
              <Row className="justify-content-center">
                <Col md={5} className="p-5 position-relative">
                  <Row>
                    <Col md={12}>
                      {/* preloader */}
                      {this.props.loading && <Loader />}

                      <div className="mx-auto mb-5" />

                      <h6 className="h5 mt-4">Forgot Password?</h6>
                      <div className="mb-4">
                        <p className="verify-info font-weight-bold text-muted mb-0">
                          Enter the email you’ve registered with.
                        </p>
                        <p className="verify-info font-weight-bold text-muted mb-0">
                          We’ll send you the password reset instructions there.
                        </p>
                      </div>

                      {this.props.error && (
                        <Alert color="danger" isOpen={this.props.error}>
                          <div>{this.props.error}</div>
                        </Alert>
                      )}

                      <AvForm
                        onValidSubmit={this.handleValidSubmit}
                        className="authentication-form"
                      >
                        <AvGroup className="float-container mb-4">
                          <Label for="email">Your Email Address</Label>
                          <AvInput
                            type="email"
                            name="email"
                            id="email"
                            // placeholder="hello@avenir.com"
                            value={this.state.email}
                            onFocus={this.activateField}
                            onBlur={this.deactivateField}
                            required
                          />
                          <AvFeedback>Email is invalid</AvFeedback>
                        </AvGroup>

                        <FormGroup className="form-group mb-0 text-center">
                          <Container>
                            <Row>
                              <Col md={{size: 8}}>
                                <Button color="blue" className="btn-block">
                                  Request Password Reset
                                </Button>
                              </Col>
                              <Col md={4}>
                                <Link
                                  to="/account/login"
                                  className="btn btn-block btn-blue-inverted"
                                >
                                  Back to Login
                                </Link>
                              </Col>
                            </Row>
                          </Container>
                        </FormGroup>
                      </AvForm>
                    </Col>
                  </Row>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <Row className="mt-3">
                    <Col className="col-8 text-center">
                      <p className="text-muted">
                        Trouble signing in?{' '}
                        <Link
                          to="/account/register"
                          className="blue-text font-weight-bold ml-1"
                        >
                          Contact Support
                        </Link>
                      </p>
                    </Col>
                    <Col className="col-4">
                      <p className="text-muted font-weight-bold float-right">
                        <span onClick={this.togglePrivacy} onKeyPress={this.togglePrivacy}>Privacy</span> | <span onClick={this.toggleTerms} onKeyPress={this.toggleTerms}>Terms</span>
                      </p>
                    </Col>
                  </Row>
                </Col>

                <Col md={7} className="d-none d-md-inline-block login-bg">
                  <div className="auth-page-sidebar">
                    <div className="overlay" />
                  </div>
                </Col>
              </Row>
            </Container>
            <Modal isOpen={privacyModal} toggle={this.togglePrivacy} centered className="">
              <ModalHeader>PRIVACY POLICY</ModalHeader>
              <ModalBody>The Avenir Privacy Policies govern your use of the Services, which allow self-directed Users to: (i) designate Selected Amounts from the Users’ connected accounts for Coinbits to use; (ii) designate Coinbits, as the User’s agent, to automatically purchase and own cryptocurrency for the equivalent value of the Selected Amount, and deposit and hold purchased cryptocurrency via Coinbits’ own wallet that must be accessed with a password or by maintaining a private key (“Digital Wallet”); and (iii) receive the Withdrawal Amount from Coinbits, who will remit to the User the equivalent value in US Dollars of cryptocurrency purchased and owned by Coinbits from User’s Selected Amount upon User’s request. Users will not own cryptocurrency through the Services, and at no point will Coinbits act as a custodian of any User- owned cryptocurrency. Coinbits solely acts as Users’ designated agent with limited actual authority to purchase cryptocurrency that Coinbits owns outright by automatically rounding up pre-completed transactions in the Selected Amount, and Users solely receive the right to view the transactions performed on and the value of the User Account and the right to receive the dollar equivalent amount of cryptocurrency purchased by Coinbits using the Selected Amount by Withdrawal Request. Users have no right or discretion to withdraw, pledge, trade, or otherwise dispose of any cryptocurrency held by Coinbits. Any access to and use of Coinbits’ website, mobile applications, and any other online services provided to automatically debit and credit User’s designated account(s) (as part of the Services) will be subject to and governed by the Coinbits Terms and Policies. You understand that we may revise, update, and add new Coinbits Terms and Policies in our sole discretion, and may update the existing Coinbits Terms and Policies from time to time as described therein. Where appropriate, we may seek to provide advance notice before updated Terms and Policies become effective. You agree that we may notify you of the updated Terms and Policies by posting them on the Services (such as on our website), and that your use of the Services after the effective date of the updated Terms and Policies (or engaging in such other conduct as we may reasonably specify) constitutes your agreement to the updated Terms and Policies. It is your responsibility to check the Coinbits Terms and Policies posted on the Services periodically so that you are aware of any changes, as they are binding on you. The Coinbits Terms and Policies do not constitute a prospectus of any sort, are not a solicitation for investment and do not pertain in any way to an offering of securities in any jurisdiction. It is a description of the Services’ terms and conditions.</ModalBody>
            </Modal>
            <Modal isOpen={termsModal} toggle={this.toggleTerms} centered className="">
              <ModalHeader>TERMS AND CONDITIONS</ModalHeader>
              <ModalBody>The Coinbits Terms and Policies govern your use of the Services, which allow self-directed Users to: (i) designate Selected Amounts from the Users’ connected accounts for Coinbits to use; (ii) designate Coinbits, as the User’s agent, to automatically purchase and own cryptocurrency for the equivalent value of the Selected Amount, and deposit and hold purchased cryptocurrency via Coinbits’ own wallet that must be accessed with a password or by maintaining a private key (“Digital Wallet”); and (iii) receive the Withdrawal Amount from Coinbits, who will remit to the User the equivalent value in US Dollars of cryptocurrency purchased and owned by Coinbits from User’s Selected Amount upon User’s request. Users will not own cryptocurrency through the Services, and at no point will Coinbits act as a custodian of any User- owned cryptocurrency. Coinbits solely acts as Users’ designated agent with limited actual authority to purchase cryptocurrency that Coinbits owns outright by automatically rounding up pre-completed transactions in the Selected Amount, and Users solely receive the right to view the transactions performed on and the value of the User Account and the right to receive the dollar equivalent amount of cryptocurrency purchased by Coinbits using the Selected Amount by Withdrawal Request. Users have no right or discretion to withdraw, pledge, trade, or otherwise dispose of any cryptocurrency held by Coinbits. Any access to and use of Coinbits’ website, mobile applications, and any other online services provided to automatically debit and credit User’s designated account(s) (as part of the Services) will be subject to and governed by the Coinbits Terms and Policies. You understand that we may revise, update, and add new Coinbits Terms and Policies in our sole discretion, and may update the existing Coinbits Terms and Policies from time to time as described therein. Where appropriate, we may seek to provide advance notice before updated Terms and Policies become effective. You agree that we may notify you of the updated Terms and Policies by posting them on the Services (such as on our website), and that your use of the Services after the effective date of the updated Terms and Policies (or engaging in such other conduct as we may reasonably specify) constitutes your agreement to the updated Terms and Policies. It is your responsibility to check the Coinbits Terms and Policies posted on the Services periodically so that you are aware of any changes, as they are binding on you. The Coinbits Terms and Policies do not constitute a prospectus of any sort, are not a solicitation for investment and do not pertain in any way to an offering of securities in any jurisdiction. It is a description of the Services’ terms and conditions.</ModalBody>
            </Modal>
          </div>
        )}
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  const { user, loading, error } = state.Auth;
// const { loading, error } = state.Auth;
  return { user, loading, error };
// return { loading, error };
}

export default connect(mapStateToProps)(ForgotPassword)
// export default connect(null, {loginUser})(ForgotPassword)
// export default connect(mapStateToProps, { loginUser })(ForgotPassword);

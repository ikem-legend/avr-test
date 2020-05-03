import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect, Link, withRouter} from 'react-router-dom'
import {Container, Row, Col, Label, FormGroup, Button, Alert} from 'reactstrap'
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback,
} from 'availity-reactstrap-validation'

import Logo from '../../assets/images/avenir-logo-color.svg'
import {loginUser, showFeedback} from '../../redux/actions'
import {isUserAuthenticated} from '../../helpers/authUtils'
import Loader from '../../components/Loader'
import PrivacyModal from './PrivacyModal'
import TermsModal from './TermsModal'

class Login extends Component {
  _isMounted = false

  constructor(props) {
    super(props)

    this.handleValidSubmit = this.handleValidSubmit.bind(this)
    this.state = {
      email: '',
      password: '',
      privacyModal: false,
      termsModal: false,
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
   * @param {object} event The event object
   * @param {object} values Values to be submitted
   */
  handleValidSubmit = async (event, values) => {
    const {history} = this.props
    await this.props.loginUser(values, history)
    if (this.props.error && this.props.error.message) {
      this.props.showFeedback('Error logging in, ...', 'error')
    }
  }

  activateField = e => {
    document
      .querySelector(`.float-container #${e.target.name}`)
      .parentElement.classList.add('active')
    document.querySelector(
      `.float-container #${e.target.name}`,
    ).parentElement.style.borderLeft = '2px solid #1ca4a9'
  }

  deactivateField = e => {
    document.querySelector(
      `.float-container #${e.target.name}`,
    ).parentElement.style.borderLeft = '1px solid #ccc'
    if (e.target.value === '') {
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
  }

  togglePrivacy = () => {
    const {privacyModal} = this.state
    this.setState({
      privacyModal: !privacyModal,
    })
  }

  toggleTerms = () => {
    const {termsModal} = this.state
    this.setState({
      termsModal: !termsModal,
    })
  }

  /**
   * Redirect to root
   * @returns {object} Redirect component
   */
  renderRedirectToRoot = () => {
    const isAuthTokenValid = isUserAuthenticated()
    if (isAuthTokenValid) {
      return <Redirect to="/dashboard" />
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
              <Row className="justify-content-center position-absolute h-100 w-100">
                <Col md={5} className="p-5">
                  <div className="position-relative">
                    <Row>
                      <Col md={12}>
                        {/* preloader */}
                        {this.props.loading && <Loader />}

                        <div className="mt-5 mb-5 pl-5 avr-logo">
                          <img src={Logo} alt="App logo" />
                        </div>

                        <h3 className="mb-4 mt-4 pl-5">Welcome back!</h3>

                        {this.props.error && (
                          <div className="pl-5">
                            <Alert color="danger" isOpen={this.props.error}>
                              <div>Invalid email or password</div>
                            </Alert>
                          </div>
                        )}

                        <AvForm
                          onValidSubmit={this.handleValidSubmit}
                          className="authentication-form pl-5"
                        >
                          <AvGroup className="float-container n1 mb-0">
                            <Label for="email">Email Address</Label>
                            <AvInput
                              type="email"
                              name="email"
                              id="email"
                              value={this.state.email}
                              onFocus={this.activateField}
                              onBlur={this.deactivateField}
                              required
                            />
                            <AvFeedback data-testid="email-error">
                              Email is invalid
                            </AvFeedback>
                          </AvGroup>

                          <AvGroup className="mb-5 float-container">
                            <Label for="password">Password</Label>
                            <AvInput
                              type="password"
                              name="password"
                              id="password"
                              value={this.state.password}
                              onFocus={this.activateField}
                              onBlur={this.deactivateField}
                              required
                            />
                            <AvFeedback data-testid="password-error">
                              This field is invalid
                            </AvFeedback>
                            <Link
                              to="/account/forgot-password"
                              className="mt-3 float-sm-right float-left blue-text font-weight-bold text-unline-dashed ml-1"
                            >
                              Forgot password?
                            </Link>
                          </AvGroup>

                          <FormGroup className="form-group mb-0 text-center">
                            <Container>
                              <Row>
                                <Col md={{offset: 4, size: 4}} xs={6}>
                                  <Button
                                    color="blue"
                                    block
                                    className="mb-1 login-btn"
                                  >
                                    Login
                                  </Button>
                                </Col>
                                <Col md={4} xs={6} className="pr-0">
                                  <Link
                                    to="/account/signup"
                                    className="mb-1 btn btn-blue-inverted btn-block login-btn"
                                  >
                                    Sign Up
                                  </Link>
                                </Col>
                              </Row>
                            </Container>
                          </FormGroup>
                        </AvForm>
                      </Col>
                    </Row>
                  </div>
                  <div className="position-absolute w-100 login-bottom">
                    <Row className="mt-3 pl-5">
                      <Col className="order-12 order-sm-1" xs={12} sm={6}>
                        <p className="text-muted">
                          Trouble signing in?{' '}
                          <Link
                            to="/account/customer-support"
                            className="blue-text font-weight-bold ml-1"
                          >
                            Contact Support
                          </Link>
                        </p>
                      </Col>
                      <Col
                        className="order-1 order-sm-12 offset-xs-3 text-sm-right"
                        xs={12}
                        sm={4}
                      >
                        <p className="text-muted float-sm-right">
                          <span
                            onClick={this.togglePrivacy}
                            onKeyPress={this.togglePrivacy}
                          >
                            Privacy
                          </span>{' '}
                          |{' '}
                          <span
                            onClick={this.toggleTerms}
                            onKeyPress={this.toggleTerms}
                          >
                            Terms
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </div>
                </Col>

                <Col md={7} className="d-none d-md-inline-block login-bg">
                  <div className="auth-page-sidebar"></div>
                </Col>
              </Row>
            </Container>
            <PrivacyModal isOpen={privacyModal} toggle={this.togglePrivacy} />
            <TermsModal isOpen={termsModal} toggle={this.toggleTerms} />
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

export default connect(mapStateToProps, {loginUser, showFeedback})(
  withRouter(Login),
)

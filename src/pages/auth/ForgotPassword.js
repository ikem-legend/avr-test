import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect, Link} from 'react-router-dom'

import {
  Container,
  Row,
  Col,
  // Card,
  // CardBody,
  Label,
  FormGroup,
  Button,
  Alert,
  // InputGroup,
  // InputGroupAddon,
} from 'reactstrap'
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback,
} from 'availity-reactstrap-validation'
// import {Mail, Lock} from 'react-feather'

import {loginUser} from '../../redux/actions'
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
   */
  handleValidSubmit = (event, values) => {
    this.props.loginUser(values.email, values.password, this.props.history)
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

  /**
   * Redirect to root
   */
  renderRedirectToRoot = () => {
    const isAuthTokenValid = isUserAuthenticated()
    if (isAuthTokenValid) {
      return <Redirect to="/" />
    }
  }

  render() {
    const isAuthTokenValid = isUserAuthenticated()
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

                      <div className="mx-auto mb-5"></div>

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
                                <Button
                                  color="blue-inverted"
                                  className="btn-block"
                                >
                                  Back to Login
                                </Button>
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
                        Privacy | Terms
                      </p>
                    </Col>
                  </Row>
                </Col>

                <Col md={7} className="d-none d-md-inline-block login-bg">
                  <div className="auth-page-sidebar">
                    <div className="overlay"></div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </Fragment>
    )
  }
}

// const mapStateToProps = state => {
// const { user, loading, error } = state.Auth;
// const { loading, error } = state.Auth;
// return { user, loading, error };
// return { loading, error };
// }

// export default connect(mapStateToProps)(ForgotPassword)
export default connect(null, {loginUser})(ForgotPassword)
// export default connect(mapStateToProps, { loginUser })(ForgotPassword);
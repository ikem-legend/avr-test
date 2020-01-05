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

class Login extends Component {
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
  	console.log(values)
  	const user = {...values}
  	console.log(user)
    this.props.loginUser(user, this.props.history)
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

                      <h6 className="h5 mb-4 mt-4">Welcome back!</h6>

                      {this.props.error && (
                        <Alert color="danger" isOpen={this.props.error}>
                          <div>{this.props.error}</div>
                        </Alert>
                      )}

                      <AvForm
                        onValidSubmit={this.handleValidSubmit}
                        className="authentication-form"
                      >
                        <AvGroup className="float-container n1 mb-0">
                          <Label for="email">Email</Label>
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
                          <AvFeedback>This field is invalid</AvFeedback>
                        </AvGroup>

                        <AvGroup className="mb-5 float-container">
                          <Label for="password">Password</Label>
                          <AvInput
                            type="password"
                            name="password"
                            id="password"
                            // placeholder="Enter your password"
                            value={this.state.password}
                            onFocus={this.activateField}
                            onBlur={this.deactivateField}
                            required
                          />
                          <AvFeedback>This field is invalid</AvFeedback>
                          <Link
                            to="/account/forgot-password"
                            className="mt-3 float-right blue-text font-weight-bold text-unline-dashed ml-1"
                          >
                            Forgot password?
                          </Link>
                        </AvGroup>

                        <FormGroup className="form-group mb-0 text-center">
                          <Container>
                            <Row>
                              <Col md={{offset: 4, size: 4}}>
                                <Button color="blue" className="btn-block">
                                  Login
                                </Button>
                              </Col>
                              <Col md={4}>
                                <Button
                                  color="blue-inverted"
                                  className="btn-block"
                                >
                                  Sign Up
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
                      <p className="text-muted float-right">Privacy | Terms</p>
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

// export default connect(mapStateToProps)(Login)
export default connect(null, {loginUser})(Login)
// export default connect(mapStateToProps, { loginUser })(Login);

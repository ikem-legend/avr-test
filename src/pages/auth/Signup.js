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
  CustomInput,
} from 'reactstrap'
// import { Container, Row, Col, Card, CardBody, Label, FormGroup, Button, Alert, InputGroup, InputGroupAddon, CustomInput } from 'reactstrap';
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback,
} from 'availity-reactstrap-validation'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import MaskedInput from 'react-text-mask'
// import { Mail, Lock, User } from 'react-feather';

import {registerUser} from '../../redux/actions'
import {isUserAuthenticated} from '../../helpers/authUtils'
import Loader from '../../components/Loader'
// import logo from '../../assets/images/logo.png';

class Signup extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      inputs: {
        firstname: '',
        lastname: '',
        phone: '',
        ssn: '',
        dob: new Date('2004-01-01').getTime(),
        address: '',
        zipcode: '',
        city: '',
        country: '',
      },
      countries: [
        {value: 'usa', label: 'USA'},
        {value: 'uk', label: 'UK'},
        {value: 'singapore', label: 'Singapore'},
      ],
      cities: [
        {value: 'new york', label: 'New York'},
        {value: 'la', label: 'Los Angeles'},
        {value: 'atl', label: 'Atlanta'},
      ],
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
  handleValidSubmit = (event, values) => {
    this.props.registerUser(values.fullname, values.email, values.password)
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
    console.log(e)
    e.preventDefault()
    const {name, value} = e.target
    this.setState(prevState => ({
      ...prevState,
      inputs: {
        ...prevState.inputs,
        [name]: value,
      },
    }))
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

  /**
   * Redirect to confirm
   */
  renderRedirectToConfirm = () => {
    return <Redirect to="/account/confirm" />
  }

  render() {
    const isAuthTokenValid = isUserAuthenticated()
    const {
      firstname,
      lastname,
      phone,
      dob,
      ssn,
      address,
      zipcode,
      city,
      country,
    } = this.state.inputs
    return (
      <Fragment>
        {this.renderRedirectToRoot()}

        {Object.keys(this.props.user || {}).length > 0 &&
          this.renderRedirectToConfirm()}

        {(this._isMounted || !isAuthTokenValid) && (
          <div className="account-pages mt-5 mb-5">
            <Container>
              <Row className="justify-content-center">
                <Col xl={10}>
                  <Row>
                    <Col md={6} className="d-none d-md-inline-block">
                      <div className="auth-page-sidebar">
                        <div className="auth-user-testimonial">
                          <p className="lead font-weight-bold">
                            Create an Account
                          </p>
                          <p className="font-size-24 font-weight-bold mb-1">
                            Confirm your Identity
                          </p>
                        </div>
                      </div>
                      <div className="overlay login-bg"></div>
                    </Col>
                    <Col md={6} className="position-relative">
                      {/* preloader */}
                      {this.props.loading && <Loader />}

                      <div className="auth-page-sidebar">
                        <div className="overlay"></div>
                        <div className="auth-user-testimonial">
                          <p className="verify-info font-weight-bold text-muted mb-0">
                            U.S financial regulations require your identity to
                            be verified.
                          </p>
                          <p className="verify-info font-weight-bold text-muted mb-0">
                            After you link your bank account, you can start
                            rounding up for crypto investment
                          </p>
                        </div>
                      </div>
                      <h6 className="h5 mb-0 mt-4"></h6>
                      <p className="text-muted mt-1 mb-4">
                        Enter your email address and password to access admin
                        panel.
                      </p>

                      {this.props.error && (
                        <Alert color="danger" isOpen={this.props.error}>
                          <div>{this.props.error}</div>
                        </Alert>
                      )}

                      <AvForm
                        onValidSubmit={this.handleValidSubmit}
                        className="authentication-form"
                      >
                        <Row>
                          <Col md={6}>
                            <AvGroup className="float-container">
                              <Label for="firstname">First Name</Label>
                              <AvInput
                                type="text"
                                name="firstname"
                                id="firstname"
                                // placeholder="Avenir A"
                                value={firstname}
                                onFocus={this.activateField}
                                onBlur={this.deactivateField}
                                onChange={this.updateInputValue}
                                validate={{
                                  pattern: {
                                    value: '^[A-Za-z]+$',
                                    errorMessage:
                                      'Your name must be composed only with letters',
                                  },
                                  minLength: {
                                    value: 3,
                                    errorMessage:
                                      'Your name must be between 3 and 20 characters',
                                  },
                                  maxLength: {
                                    value: 20,
                                    errorMessage:
                                      'Your name must be between 3 and 20 characters',
                                  },
                                }}
                                required
                              />

                              <AvFeedback>First Name is invalid</AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={6}>
                            <AvGroup className="float-container">
                              <Label for="lastname">Last Name</Label>
                              <AvInput
                                type="text"
                                name="lastname"
                                id="lastname"
                                // placeholder="Avenir A"
                                value={lastname}
                                onFocus={this.activateField}
                                onBlur={this.deactivateField}
                                onChange={this.updateInputValue}
                                validate={{
                                  pattern: {
                                    value: '^[A-Za-z]+$',
                                    errorMessage:
                                      'Your name must be composed only with letters',
                                  },
                                  minLength: {
                                    value: 3,
                                    errorMessage:
                                      'Your name must be between 3 and 20 characters',
                                  },
                                  maxLength: {
                                    value: 20,
                                    errorMessage:
                                      'Your name must be between 3 and 20 characters',
                                  },
                                }}
                                required
                              />

                              <AvFeedback>Last Name is invalid</AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={6}>
                            <AvGroup className="float-container">
                              <Label for="phone">Phone</Label>
                              <AvInput
                                type="phone"
                                name="phone"
                                id="phone"
                                value={phone}
                                onFocus={this.activateField}
                                onBlur={this.deactivateField}
                                onChange={this.updateInputValue}
                                validate={{
                                  pattern: {
                                    value: '^[0-9]+$',
                                    errorMessage:
                                      'Your phone number must be composed only with numbers',
                                  },
                                  minLength: {
                                    value: 10,
                                    errorMessage:
                                      'Your phone number must be between 10 and 15 characters',
                                  },
                                  maxLength: {
                                    value: 15,
                                    errorMessage:
                                      'Your phone number must be between 10 and 15 characters',
                                  },
                                }}
                                required
                              />

                              <AvFeedback>Phone number is invalid</AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={6}>
                            <AvGroup className="float-container active">
                              <Label for="dob">Date of Birth</Label>
                              <div className="form-group mb-sm-0 mr-2">
                                <Flatpickr
                                  name="dob"
                                  value={dob}
                                  onChange={date =>
                                    this.setState(prevState => ({
                                      ...prevState,
                                      inputs: {
                                        ...prevState.inputs,
                                        dob: date,
                                      },
                                    }))
                                  }
                                  className="form-control"
                                  options={{
                                    maxDate: new Date('2004-01-01'),
                                    defaultDate: dob,
                                    dateFormat: 'd-M-Y',
                                  }}
                                />
                              </div>
                              <AvFeedback>This field is invalid</AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={12}>
                            <AvGroup className="ssn">
                              <Row>
                                <Col md={6}>
                                  <Label for="ssn">
                                    Social Security Number
                                  </Label>
                                  <p>
                                    We need your SSN to verify your identity
                                    with our payment provider. This information
                                    is encrypted and not stored on Avenir
                                    servers
                                  </p>
                                </Col>
                                <Col
                                  md={6}
                                  className="d-flex align-items-center"
                                >
                                  <MaskedInput
                                    // mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    mask={[
                                      /[0-7]/,
                                      /\d/,
                                      /[1-9]/,
                                      '-',
                                      /\d/,
                                      /[1-9]/,
                                      '-',
                                      /\d/,
                                      /\d/,
                                      /\d/,
                                      /[1-9]/,
                                    ]}
                                    className="form-control text-center"
                                    placeholder="999-99-9999"
                                    // placeholder="___-__-____"
                                    value={ssn}
                                    // onChange={this.updateInputValue}
                                    required
                                  />
                                  <AvFeedback>
                                    Social Security Number is invalid
                                  </AvFeedback>
                                </Col>
                              </Row>
                            </AvGroup>
                          </Col>
                          <Col md={8}>
                            <AvGroup className="float-container mb-3">
                              <Label for="address">Street address</Label>
                              <AvInput
                                type="address"
                                name="address"
                                id="address"
                                value={address}
                                // placeholder="Enter your password"
                                onFocus={this.activateField}
                                onBlur={this.deactivateField}
                                onChange={this.updateInputValue}
                                required
                              />
                              <AvFeedback>Address is invalid</AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={4}>
                            <AvGroup className="float-container">
                              <Label for="zipcode">Zipcode</Label>
                              <AvInput
                                type="zipcode"
                                name="zipcode"
                                id="zipcode"
                                value={zipcode}
                                onFocus={this.activateField}
                                onBlur={this.deactivateField}
                                onChange={this.updateInputValue}
                                validate={{
                                  pattern: {
                                    value: '^[0-9]{6}$',
                                    errorMessage:
                                      'Your zipcode must be composed only with numbers',
                                  },
                                  maxLength: {value: 6},
                                }}
                                required
                              />

                              <AvFeedback>Zipcode is invalid</AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={6}>
                            <AvGroup className="float-container">
                              <Label for="city">Choose your city</Label>
                              <Select
                                options={this.state.cities}
                                value={city}
                                onChange={val =>
                                  this.setState(prevState => ({
                                    ...prevState,
                                    inputs: {
                                      ...prevState.inputs,
                                      city: val,
                                    },
                                  }))
                                }
                                required
                              />
                              <AvFeedback>Please select a city</AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={6}>
                            <AvGroup className="float-container">
                              <Label for="country">Select your country</Label>
                              <Select
                                options={this.state.countries}
                                value={country}
                                onChange={val =>
                                  this.setState(prevState => ({
                                    ...prevState,
                                    inputs: {
                                      ...prevState.inputs,
                                      country: val,
                                    },
                                  }))
                                }
                                required
                              />
                              <AvFeedback>This field is invalid</AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={12} className="mb-4">
                            <AvGroup check className="mb-4">
                              <CustomInput
                                type="checkbox"
                                id="terms"
                                className="pl-1 mb-2"
                                label="By using our services, you agree to Avenir’s Platform Agreement and Wyre’s Terms of Service and Privacy Policy"
                              />
                            </AvGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <FormGroup className="form-group mb-0 text-center">
                              <Button color="blue" className="btn-block">
                                Sign Up
                              </Button>
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <p className="text-muted login">
                              Got an account?{' '}
                              <Link
                                to="/account/login"
                                className="font-weight-bold ml-1"
                              >
                                Login here
                              </Link>
                            </p>
                          </Col>
                        </Row>
                      </AvForm>
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

// const mapStateToProps = (state) => {
// const { user, loading, error } = state.Auth;
// return { user, loading, error };
// };

export default connect(null, {registerUser})(Signup)
// export default connect(mapStateToProps, { registerUser })(Signup);

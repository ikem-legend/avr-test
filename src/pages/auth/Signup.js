import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect, Link} from 'react-router-dom'
import subYears from 'date-fns/subYears'

import {
  Container,
  Row,
  Col,
  Label,
  FormGroup,
  Button,
  CustomInput,
} from 'reactstrap'

import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback,
} from 'availity-reactstrap-validation'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import MaskedInput from 'react-text-mask'

import {callApi} from '../../helpers/api'
import {registerUser, showFeedback} from '../../redux/actions'
import {isUserAuthenticated} from '../../helpers/authUtils'
import Loader from '../../components/Loader'

class Signup extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      inputs: {
        firstname: '',
        lastname: '',
        phone: '',
        dob: subYears(new Date(), 16).getTime(),
        email: '',
        password: '',
        confirmPassword: '',
        userId: '',
        address: '',
        zipcode: '',
        city: '',
        country: '',
      },
      terms: false,
      signupError: '',
    }
    this.handleValidSubmit = this.handleValidSubmit.bind(this)
  }

  async componentDidMount() {
    this._isMounted = true
    document.body.classList.add('authentication-bg')
    const {firstname, lastname} = this.state
    // Another possible solution is to use an array to loop through the state then update field styling
    if (firstname && lastname) {
      document.querySelectorAll('.float-container').classList.add('active')
    }
    await callApi('/data/countries', null, 'GET')
      .then(response => {
        // console.log(response)
        const countryList = response.data.map(coun => ({
          value: coun.id,
          label: coun.name,
        }))
        const cityArray = response.data.map(coun =>
          coun.cities.map(city => ({value: city.id, label: city.name})),
        )
        const cityList = [].concat(...cityArray)
        this.setState({
          cities: cityList,
          countries: countryList,
        })
      })
      .catch(err => console.log(err))
  }

  componentWillUnmount() {
    this._isMounted = false
    document.body.classList.remove('authentication-bg')
  }

  /**
   * Handles the submit
   * @param {object} event The event object
   * @param {object} values Values to be submitted
   * @returns {function} showFeedback Displays feedback
   */
  handleValidSubmit = async () => {
    const {inputs: {userId, city, country}} = this.state
    if (!userId) {
      return this.props.showFeedback('Please select an image or document for upload', 'error')
    }
    if (!city.value) {
      return this.props.showFeedback('Please select your city', 'error')
    }
    if (!country.value) {
      return this.props.showFeedback('Please select your country', 'error')
    }
    if (this.state.terms) {
      const data = {...this.state.inputs}
      const {history} = this.props
      // data.ssn = data.ssn.replace(/-/g, '')
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
          delete data[key],
      )
      await this.props.registerUser(data, history)
      // const formData = new FormData()
    } else {
      this.props.showFeedback(
        'Please agree to the terms and conditions',
        'error',
      )
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
      // console.log(e.target.name)
      document
        .querySelector(`.float-container #${e.target.name}`)
        .parentElement.classList.remove('active')
    }
  }

  updateInputValue = e => {
    e.preventDefault()
    const {name, value, files} = e.target
    // console.log(name, value)
    if (files) {
      this.setState(prevState => ({
        ...prevState,
        inputs: {
          ...prevState.inputs,
          userId: files[0]
        }
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        inputs: {
          ...prevState.inputs,
          [name]: value,
        },
      }))
    }
  }

  updateTerms = e => {
    const {checked} = e.target
    this.setState({
      terms: checked,
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
    const {terms} = this.state
    const {
      firstname,
      lastname,
      phone,
      dob,
      email,
      password,
      confirmPassword,
      userId,
      address,
      zipcode,
      city,
      country,
    } = this.state.inputs
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
                          <p className="lead font-weight-bold">
                            Create an Account
                          </p>
                          <p className="font-size-24 font-weight-bold mb-1">
                            Confirm your Identity
                          </p>
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
                      </div>
                      <div className="overlay signup-bg"></div>
                    </Col>
                    <Col md={6} className="position-relative">
                      {/* preloader */}
                      {this.props.loading && <Loader />}

                      <div className="auth-page-sidebar mb-4">
                        <div className="overlay"></div>
                        <div className="auth-user-testimonial d-block d-sm-none">
                          <p className="lead font-weight-bold">
                            <span>Create an Account</span>
                            <span className="float-right back">Back to <Link to="/account/login">Login</Link></span>
                          </p>
                          <p className="font-size-24 font-weight-bold mb-1">
                            Confirm your Identity
                          </p>
                        </div>
                      </div>

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
                                    value: '^[A-Za-z ]+$',
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

                              <AvFeedback data-testid="fname-error">
                                First Name is invalid
                              </AvFeedback>
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

                              <AvFeedback data-testid="lname-error">
                                Last Name is invalid
                              </AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={6}>
                            <AvGroup className="float-container">
                              <Label for="email">Email</Label>
                              <AvInput
                                type="email"
                                name="email"
                                id="email"
                                // placeholder="Avenir A"
                                value={email}
                                onFocus={this.activateField}
                                onBlur={this.deactivateField}
                                onChange={this.updateInputValue}
                                validate={{
                                  // pattern: {
                                  //   value: '^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$',
                                  //   errorMessage:
                                  //     'Email must be valid in the format email@example.com',
                                  // },
                                  minLength: {
                                    value: 5,
                                    errorMessage:
                                      'Your email address must be between 5 and 40 characters',
                                  },
                                  maxLength: {
                                    value: 40,
                                    errorMessage:
                                      'Your email address must be between 5 and 40 characters',
                                  },
                                }}
                                required
                              />

                              <AvFeedback data-testid="email-error">
                                Email is invalid
                              </AvFeedback>
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

                              <AvFeedback data-testid="phone-error">
                                Phone number is invalid
                              </AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={6}>
                            <AvGroup className="float-container">
                              <Label for="password">Password</Label>
                              <AvInput
                                type="password"
                                name="password"
                                id="password"
                                // placeholder="Avenir A"
                                value={password}
                                onFocus={this.activateField}
                                onBlur={this.deactivateField}
                                onChange={this.updateInputValue}
                                validate={{
                                  pattern: {
                                    value:
                                      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
                                    errorMessage:
                                      'Password must contain at least 1 lowercase, 1 uppercase, 1 number and 8 characters',
                                  },
                                  minLength: {
                                    value: 8,
                                    errorMessage:
                                      'Your name must be between 8 and 20 characters',
                                  },
                                  maxLength: {
                                    value: 20,
                                    errorMessage:
                                      'Your name must be between 8 and 20 characters',
                                  },
                                }}
                                required
                              />
                              <AvFeedback data-testid="password-error">
                                Password must contain at least 1 lowercase, 1
                                uppercase, 1 number and 8 characters
                              </AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={6}>
                            <AvGroup className="float-container">
                              <Label for="confirmPassword">Confirm Password</Label>
                              <AvInput
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                // placeholder="Avenir A"
                                value={confirmPassword}
                                onFocus={this.activateField}
                                onBlur={this.deactivateField}
                                onChange={this.updateInputValue}
                                validate={{
                                  pattern: {
                                    value:
                                      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
                                    errorMessage:
                                      'Password must contain at least 1 lowercase, 1 uppercase, 1 number and 8 characters',
                                  },
                                  minLength: {
                                    value: 8,
                                    errorMessage:
                                      'Your name must be between 8 and 20 characters',
                                  },
                                  maxLength: {
                                    value: 20,
                                    errorMessage:
                                      'Your name must be between 8 and 20 characters',
                                  },
                                }}
                                required
                              />
                              <AvFeedback data-testid="password-error">
                                Passwords do not match
                              </AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={12}>
                            <AvGroup className="userId">
                              <Row>
                                <Col md={6}>
                                  <Label for="userId">
                                    Upload User ID
                                  </Label>
                                  <p>
                                    We need your means of identification to verify your identity
                                    for security purposes. This information
                                    is encrypted and not stored on Avenir
                                    servers
                                  </p>
                                </Col>
                                <Col
                                  md={6}
                                  className="d-flex align-items-center"
                                >
                                  <AvInput
                                    type="file"
                                    accept="image/*, application/pdf, application/doc"
                                    name="userId"
                                    id="userId"
                                    value={userId}
                                    className="form-control text-center"
                                    onChange={this.updateInputValue}
                                    required
                                  />
                                  <AvFeedback data-testid="ssn-error">
                                    Please select image
                                  </AvFeedback>
                                </Col>
                              </Row>
                            </AvGroup>
                          </Col>
                          <Col md={4}>
                            <AvGroup className="float-container active">
                              <Label for="dob">Date of Birth</Label>
                              <div className="form-group mb-sm-0 mr-2">
                                <Flatpickr
                                  id="dob"
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
                                    maxDate: subYears(new Date(), 16),
                                    defaultDate: dob,
                                    dateFormat: 'd-M-Y',
                                  }}
                                />
                              </div>
                              <AvFeedback>This field is invalid</AvFeedback>
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
                              <AvFeedback data-testid="address-error">
                                Address is invalid
                              </AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={5}>
                            <AvGroup className="float-container">
                              <Label for="city">Choose your city</Label>
                              <Select
                                id="city"
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
                              <AvFeedback data-testid="city-error">
                                Please select a city
                              </AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={4}>
                            <AvGroup className="float-container">
                              <Label for="country">Select your country</Label>
                              <Select
                                id="country"
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
                              <AvFeedback data-testid="country-error">
                                This field is invalid
                              </AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={3}>
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
                                    value: '^[0-9]{5}$',
                                    errorMessage:
                                      'Your zipcode must be composed only with numbers',
                                  },
                                  maxLength: {value: 5},
                                }}
                                required
                              />

                              <AvFeedback data-testid="zip-error">
                                Zipcode is invalid
                              </AvFeedback>
                            </AvGroup>
                          </Col>
                          <Col md={12} className="mb-4">
                            <AvGroup check className="mb-4">
                              <CustomInput
                                type="checkbox"
                                id="terms"
                                // value={terms}
                                checked={terms}
                                onChange={this.updateTerms}
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

const mapStateToProps = state => {
  const {user, loading, error} = state.Auth
  return {user, loading, error}
}

// export default connect(null, {registerUser})(Signup)
export default connect(mapStateToProps, {registerUser, showFeedback})(Signup)

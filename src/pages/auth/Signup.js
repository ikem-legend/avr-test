/* eslint-disable camelcase */
import React, {Component, Fragment, createRef} from 'react'
import {connect} from 'react-redux'
import {Redirect, Link} from 'react-router-dom'
// import {Cookies} from 'react-cookie'
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
        dob: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        zipcode: '',
        city: '',
        country: '',
      },
      terms: false,
      signupError: '',
      documentUploadError: false,
    }
    this.idFileInput = createRef()
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
          userId: files[0],
        },
      }))
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
   * Handles the submit
   * @returns {function} showFeedback Displays feedback
   **/
  handleValidSubmit = async () => {
    const {
      inputs: {password, confirmPassword, city, country},
    } = this.state
    const {history} = this.props
    if (!city.value) {
      return this.props.showFeedback('Please select your city', 'error')
    }
    if (!country.value) {
      return this.props.showFeedback('Please select your country', 'error')
    }
    if (password !== confirmPassword) {
      this.props.showFeedback('Passwords do not match', 'error')
    }
    if (this.state.terms) {
      const data = {...this.state.inputs}
      // Date format
      const year = new Date(data.dob).getFullYear().toString()
      // const month = new Date(data.dob).getMonth().toString();
      const month = (1 + new Date(data.dob).getMonth()).toString()
      // month = month.length > 1 ? month : `0${month}`;
      const day = new Date(data.dob).getDate().toString()
      // day = day.length > 1 ? day : `0${day}`;

      data.dob = `${month}-${day}-${year}`
      // data.dob = String(data.dob)
      data.first_name = String(data.firstname)
      data.last_name = String(data.lastname)
      data.zip_code = String(data.zipcode)
      data.city_id = String(data.city.value)
      data.country_id = String(data.country.value)
      Object.keys(data).forEach(
        key =>
          (key === 'firstname' ||
            key === 'lastname' ||
            key === 'confirmPassword' ||
            key === 'userId' ||
            key === 'zipcode' ||
            key === 'city' ||
            key === 'country') &&
          delete data[key],
      )
      await this.props.registerUser(data, history)
    } else {
      this.props.showFeedback(
        'Please agree to the terms and conditions',
        'error',
      )
    }
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
    const {
      terms,
      inputs: {
        firstname,
        lastname,
        phone,
        dob,
        email,
        password,
        confirmPassword,
        address,
        zipcode,
        city,
        country,
      },
    } = this.state
    const customStyles = {
      placeholder: defaultStyles => ({
        ...defaultStyles,
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: '#1ca4a9',
      }),
    }
    return (
      <Fragment>
        {this.renderRedirectToRoot()}

        {(this._isMounted || !isAuthTokenValid) && (
          <div className="account-pages mt-5 mb-5">
            <Container fluid>
              <Row className="justify-content-center">
                <Col xl={12}>
                  <Row>
                    <Col md={5} className="d-none d-md-inline-block">
                      <div className="auth-page-sidebar pl-5 py-0">
                        <div className="auth-user-testimonial px-5 py-0">
                          <div className="pl-5">
                            <p className="lead font-weight-bold">
                              Create an Account
                            </p>
                            <p className="font-size-24 font-weight-bold mb-1">
                              Confirm your Identity
                            </p>
                            <div className="auth-user-testimonial">
                              <p className="verify-info font-weight-bold mb-0">
                                U.S financial regulations require your identity
                                to be verified.
                              </p>
                              <p className="verify-info font-weight-bold mb-0">
                                After you link your bank account, you can start
                                rounding up for crypto investment
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="overlay signup-bg h-100"></div>
                    </Col>
                    <Col md={7} className="position-relative">
                      <div className="px-5">
                        {/* preloader */}
                        {this.props.loading && <Loader />}

                        <div className="auth-page-sidebar mb-4">
                          <div className="overlay"></div>
                          <div className="auth-user-testimonial d-block d-sm-none">
                            <p className="lead font-weight-bold">
                              <span>Create an Account</span>
                              <span className="float-right back">
                                Back to <Link to="/account/login">Login</Link>
                              </span>
                            </p>
                            <p className="font-size-24 font-weight-bold mb-1">
                              Confirm your Identity
                            </p>
                          </div>
                        </div>

                        <div className="px-5">
                          <AvForm
                            onValidSubmit={this.handleValidSubmit}
                            className="authentication-form"
                          >
                            <Row>
                              <Col md={6} className="pr-0">
                                <AvGroup className="float-container">
                                  <Label for="firstname">First Name</Label>
                                  <AvInput
                                    type="text"
                                    name="firstname"
                                    id="firstname"
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
                              <Col md={6} className="pr-0">
                                <AvGroup className="float-container">
                                  <Label for="email">Email Address</Label>
                                  <AvInput
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onFocus={this.activateField}
                                    onBlur={this.deactivateField}
                                    onChange={this.updateInputValue}
                                    validate={{
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
                                  <Label for="phone">Phone Number</Label>
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
                              <Col md={6} className="pr-0">
                                <AvGroup className="float-container">
                                  <Label for="password">Password</Label>
                                  <AvInput
                                    type="password"
                                    name="password"
                                    id="password"
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
                                    Password must contain at least 1 lowercase,
                                    1 uppercase, 1 number and 8 characters
                                  </AvFeedback>
                                </AvGroup>
                              </Col>
                              <Col md={6}>
                                <AvGroup className="float-container">
                                  <Label for="confirmPassword">
                                    Confirm Password
                                  </Label>
                                  <AvInput
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
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
                              <Col md={4} className="pr-0">
                                <AvGroup className="float-container active">
                                  <Label for="dob">Date of Birth</Label>
                                  <div className="form-group mb-sm-0 mr-2">
                                    <Flatpickr
                                      id="dob"
                                      name="dob"
                                      value={dob}
                                      placeholder="MM-DD-YYYY"
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
                                        maxDate: subYears(new Date(), 18),
                                        minDate: subYears(new Date(), 100),
                                        // defaultDate: dob,
                                        dateFormat: 'm-d-Y',
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
                                    className="location"
                                    styles={customStyles}
                                    placeholder="Select your city"
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
                              <Col md={4} className="pl-0 pr-1">
                                <AvGroup className="float-container">
                                  <Label for="country">
                                    Select your country
                                  </Label>
                                  <Select
                                    id="country"
                                    options={this.state.countries}
                                    value={country}
                                    className="location"
                                    styles={customStyles}
                                    placeholder="Select your country"
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
                                    className="mt-1"
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
                                    Create an account
                                  </Button>
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <p className="login">
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
                        </div>
                      </div>
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

export default connect(mapStateToProps, {registerUser, showFeedback})(Signup)

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Tab,
  TabPane,
  TabContent,
} from 'reactstrap'
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback,
} from 'availity-reactstrap-validation'
import Flatpickr from 'react-flatpickr'
import Select from 'react-select'
import subYears from 'date-fns/subYears'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'
import SaveLoader from '../../assets/images/spin-loader.gif'
import StyledDropzone from '../../components/ImagePicker'
import DefaultImage from '../../assets/images/default-image.png'

class EditProfile extends Component {
  constructor() {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      address: '',
      zipCode: '',
      referralUrl: '',
      loadingProfileUpdate: false,
      regModal: false,
      loadingRegUpload: false,
      userDocument: [],
    }
  }

  updateFields = e => {
    const {name, value} = e.target
    // Update validation logic
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  componentDidUpdate(prevProps) {
    if (this.props.firstName.length > prevProps.firstName.length) {
      this.getProfileDetails()
    }
  }

  getProfileDetails = () => {
    const {
      firstName,
      lastName,
      dob,
      phone,
      email,
      address,
      city,
      country,
      zipCode,
      referralUrl,
    } = this.props
    this.setState({
      firstName,
      lastName,
      email,
      phone,
      dob,
      address,
      city,
      country,
      zipCode,
      referralUrl,
    })
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

  toggleUploadReg = () => {
    const {regModal} = this.state
    this.setState({
      regModal: !regModal,
    })
  }

  updateProfile = () => {
    const {
      firstName,
      lastName,
      dob,
      phone,
      email,
      address,
      zipCode,
      referralUrl,
    } = this.state
    const {loadUserData} = this.props
    // const [first_name, last_name] = String(name).split(' ')
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      dob,
      address,
      zip_code: zipCode,
      identifier: referralUrl,
    }
    this.setState({
      loadingProfileUpdate: true,
    })
    callApi('/user/profile/update', userData, 'POST', this.props.user.token)
      .then(() => {
        loadUserData()
        this.props.showFeedback('Profile updated successfully', 'success')
      })
      .catch(() => {
        this.props.showFeedback(
          'Error updating profile, please try again',
          'error',
        )
      })
      .finally(() => {
        this.setState({
          loadingProfileUpdate: false,
        })
      })
  }

  render() {
    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      address,
      city,
      country,
      zipCode,
      referralUrl,
      loadingProfileUpdate,
      regModal,
      loadingRegUpload,
      userDocument,
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
      <Container fluid className="account-pages mb-5">
        {/*<Row className="justify-content-center">*/}
        <AvForm onValidSubmit={this.updateProfile}>
          <Row>
            <Col md={6} className="pr-0">
              <AvGroup className="float-container active">
                <Label for="firstName">First Name</Label>
                <AvInput
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={firstName}
                  onFocus={this.activateField}
                  onBlur={this.deactivateField}
                  onChange={this.updateFields}
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
                {/*<AvInput type="text" name="name" value={name} onChange={this.updateFields} />*/}
              </AvGroup>
            </Col>
            <Col md={6}>
              <AvGroup className="float-container active">
                <Label for="lastName">Last Name</Label>
                <AvInput
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={lastName}
                  onFocus={this.activateField}
                  onBlur={this.deactivateField}
                  onChange={this.updateFields}
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
              <AvGroup className="float-container active">
                <Label for="email">Email Address</Label>
                <AvInput
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onFocus={this.activateField}
                  onBlur={this.deactivateField}
                  onChange={this.updateFields}
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
              <AvGroup className="float-container active">
                <Label for="phone">Phone Number</Label>
                <AvInput
                  type="phone"
                  name="phone"
                  id="phone"
                  value={phone}
                  onFocus={this.activateField}
                  onBlur={this.deactivateField}
                  onChange={this.updateFields}
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
                      this.setState({
                        dob: date,
                      })
                    }
                    className="form-control"
                    options={{
                      maxDate: subYears(new Date(), 18),
                      minDate: subYears(new Date(), 100),
                      defaultDate: dob,
                      dateFormat: 'm-d-Y',
                    }}
                  />
                </div>
                <AvFeedback>This field is invalid</AvFeedback>
              </AvGroup>
            </Col>
            <Col md={8}>
              <AvGroup className="float-container active mb-3">
                <Label for="address">Street address</Label>
                <AvInput
                  type="address"
                  name="address"
                  id="address"
                  value={address}
                  onFocus={this.activateField}
                  onBlur={this.deactivateField}
                  onChange={this.updateFields}
                  required
                />
                <AvFeedback data-testid="address-error">
                  Address is invalid
                </AvFeedback>
              </AvGroup>
            </Col>
            <Col md={5}>
              <AvGroup className="float-container active">
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
              <AvGroup className="float-container active">
                <Label for="country">Select your country</Label>
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
              <AvGroup className="float-container active">
                <Label for="zipcode">Zipcode</Label>
                <AvInput
                  type="zipcode"
                  name="zipcode"
                  id="zipcode"
                  className="mt-1"
                  value={zipCode}
                  onFocus={this.activateField}
                  onBlur={this.deactivateField}
                  onChange={this.updateFields}
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
            <Col md={12}>
              <AvGroup>
                <label htmlFor="referral link">
                  Referral Custom URL{' '}
                  <span className="text-muted font-size-12">
                    (This can only be changed once)
                  </span>
                </label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>https://avenir-app.com/r/</InputGroupText>
                  </InputGroupAddon>
                  <AvInput
                    type="text"
                    name="referralUrl"
                    value={referralUrl}
                    onChange={this.updateFields}
                    readOnly={Boolean(referralUrl)}
                  />
                </InputGroup>
              </AvGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                color="blue"
                block
                className="mt-1 mb-5"
                onClick={this.toggleUploadReg}
              >
                Upload User Registration
              </Button>
              <Modal
                isOpen={regModal}
                toggle={this.toggleUploadReg}
                centered
                size="lg"
              >
                <ModalHeader className="account-link-header mx-auto">
                  Upload User ID to complete profile
                </ModalHeader>
                <ModalBody className="text-center">
                  <Row>
                    <Col md={12}>
                      <p className="mb-0">
                        We need your means of identification to verify your
                        identity for security purposes.
                      </p>
                      <p>
                        This information is encrypted and not stored on Avenir
                        servers
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    {userDocument.slice(0, 2).map((image, idx) => (
                      <Col size="6" key={idx}>
                        <img
                          alt="puImg"
                          src={
                            image && image.src
                              ? image.src
                              : image
                              ? image
                              : DefaultImage
                          }
                          className="img-fluid"
                        />
                      </Col>
                    ))}
                  </Row>
                  <Row>
                    <Col md={12}>
                      <StyledDropzone
                        onUpload={this.handleUserDocument}
                        multiple
                        label="Click here to select the Front & Back or drag and drop to upload"
                        width="100%"
                      />
                    </Col>
                  </Row>
                  {loadingRegUpload ? (
                    <img
                      src={SaveLoader}
                      alt="loader"
                      style={{height: '40px', marginTop: '20px'}}
                    />
                  ) : (
                    <Button
                      onClick={this.submitUserDocument}
                      color="inv-blue"
                      className="mt-2"
                    >
                      Upload
                    </Button>
                  )}
                </ModalBody>
              </Modal>
            </Col>
          </Row>
          <Row>
            <Col md={{size: 4, offset: 8}}>
              {loadingProfileUpdate ? (
                <img src={SaveLoader} alt="loader" style={{height: '40px'}} />
              ) : (
                <Button color="red" block onClick={this.updateProfile}>
                  Save
                </Button>
              )}
            </Col>
          </Row>
        </AvForm>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps, {showFeedback})(EditProfile)

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
import {toast} from 'react-toastify'
import {callApi} from '../../helpers/api'
import {resizeImage, toFormData} from '../../helpers/utils'
import {showFeedback} from '../../redux/actions'
import DocumentUpload from '../../components/DocumentUpload'
import ImageUpload from '../../components/ImageUpload'
import SaveLoader from '../../assets/images/spin-loader.gif'

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
      city: '',
      country: '',
      referralUrl: '',
      loadingProfileUpdate: false,
      loadingUpload: false,
      userDocument: ['', ''],
      userDocumentModal: false,
      idType: 'individualProofOfAddress',
      profileImgModal: false,
      profileImg: '',
      loadingImgUpload: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.firstName.length > prevProps.firstName.length) {
      this.getProfileDetails()
    }
  }

  /**
   * Update field in state
   * @param {object} e Global event object
   */
  updateFields = e => {
    const {name, value} = e.target
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  /**
   * Update local state with user data including the country and city list
   */
  getProfileDetails = async () => {
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
    await callApi('/data/countries', null, 'GET')
      .then(response => {
        const countryList = response.data.map(coun => ({
          value: coun.id,
          label: coun.name,
        }))
        const cityArray = response.data.map(coun =>
          coun.cities.map(cityDetail => ({
            value: cityDetail.id,
            label: cityDetail.name,
          })),
        )
        const cityList = [].concat(...cityArray)
        this.setState({
          cities: cityList,
          countries: countryList,
        })
      })
      .catch(err => console.log(err))
    const {cities, countries} = this.state
    const selectedCity = cities.filter(cityDet => cityDet.label === city)[0]
    const selectedCountry = countries.filter(
      counDet => counDet.label === country,
    )[0]
    this.setState({
      firstName,
      lastName,
      email,
      phone,
      dob,
      address,
      city: selectedCity,
      country: selectedCountry,
      zipCode,
      referralUrl,
    })
  }

  /**
   * Move label to top of field on data entry
   * @param {object} e Global event object
   */
  activateField = e => {
    document
      .querySelector(`.float-container #${e.target.name}`)
      .parentElement.classList.add('active')
    document.querySelector(
      `.float-container #${e.target.name}`,
    ).parentElement.style.borderLeft = '2px solid #1ca4a9'
  }

  /**
   * Move label to center of field when empty
   * @param {object} e Global event object
   */
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

  /**
   * Toggle image upload modal
   */
  toggleImgUpload = () => {
    const {userDocumentModal} = this.state
    this.setState({
      userDocumentModal: !userDocumentModal,
    })
  }

  /** Update Document Upload State
   * Used to ensure that the image upload popup only displays once per session for users who haven't done it yet
   * However it does not popup on the edit profile page as it does on the Dashboard so it is of less use here
   */
  updateDocUploadState = () => {
    const userData = JSON.parse(localStorage.getItem('avenirApp'))
    Object.assign(userData, {docUploadState: true})
    const userDataStr = JSON.stringify(userData)
    localStorage.setItem('avenirApp', userDataStr)
  }

  /**
   * Specify ID type
   * @param {number} id ID indicator
   */
  specifyId = id => {
    if (id === 1) {
      this.setState({
        idType: 'individualProofOfAddress',
        userDocument: ['', ''],
      })
    } else {
      this.setState({
        idType: 'individualGovernmentId',
        userDocument: [''],
      })
    }
  }

  /**
   * Handle ID upload state update
   * @param {file} file Image file details
   * @param {object} body Image body details
   * @returns {object} setState with image updated
   */
  handleUserDocument = (file, body) => {
    const {idType, userDocument} = this.state
    if (idType === 'individualGovernmentId' && userDocument.length >= 1) {
      // Ensure there is only 1 image in the array
      userDocument.pop()
      return resizeImage(file, body).then(blob => {
        return this.setState(prevState => ({
          userDocument: [
            {
              src: URL.createObjectURL(blob),
              blob,
            },
            ...prevState.userDocument,
          ],
        }))
      })
    }
    if (idType === 'individualProofOfAddress') {
      return resizeImage(file, body).then(blob => {
        if (userDocument.length >= 1) {
          userDocument.pop()
          // Ensure there are only 2 images in the array
          if (userDocument.length === 2) {
            userDocument.pop()
          }
          return this.setState(prevState => ({
            userDocument: [
              {
                src: URL.createObjectURL(blob),
                blob,
              },
              ...prevState.userDocument,
            ],
          }))
        } else {
          return this.setState(prevState => ({
            userDocument: [
              {
                src: URL.createObjectURL(blob),
                blob,
              },
              ...prevState.userDocument,
            ],
          }))
        }
      })
    }
  }

  /**
   * Upload ID to SendWyre
   */
  submitUserDocument = () => {
    const {userDocument, idType} = this.state
    const {user} = this.props
    const selectedImages = userDocument.filter(photo => photo && photo.blob)
    if (selectedImages.length > 0) {
      const userDocObj = selectedImages.map(img => img.blob)[0]
      const userData = toFormData({document: userDocObj, type: idType})
      this.setState({loadingUpload: true})
      callApi('/user/sendwyre/document/upload', userData, 'POST', user.token)
        .then(res => {
          toast.success(`ID upload successful, ${res.data.message}`, {
            hideProgressBar: true,
          })
          this.setState({loadingUpload: false})
          callApi('/auth/me', null, 'GET', user.token)
            .then(response => {
              const userObj = {}
              Object.assign(userObj, {...response.data}, {token: user.token})
              this.props.updateUserData(userObj)
              this.toggleImgUpload()
            })
            .catch(() => {
              this.props.showFeedback(
                'Error updating user details, please reload',
                'error',
              )
            })
        })
        .catch(err => {
          const {
            data: {error},
          } = err
          this.setState({loadingUpload: false})
          Object.keys(error).map(obj => {
            return toast.error(error[obj][0], {hideProgressBar: true})
          })
        })
    } else {
      toast.error('Please select an image to upload', {hideProgressBar: true})
    }
  }

  /**
   * Update Profile via API
   */
  updateProfile = () => {
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
    } = this.state
    const {loadUserData} = this.props
    // Date format
    const year = new Date(dob).getFullYear().toString()
    const month = (1 + new Date(dob).getMonth()).toString()
    const day = new Date(dob).getDate().toString()

    const dobStr = `${month}-${day}-${year}`
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      dob: dobStr,
      address,
      zip_code: zipCode,
      city_id: city.value,
      country_id: country.value,
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

  /**
   * Toggle Image Upload Modal
   */
  toggleProfileImgUpload = () => {
    const {profileImgModal} = this.state
    this.setState({
      profileImgModal: !profileImgModal,
    })
  }

  /**
   * Handle profile image update state
   * @param {file} file Image file details
   * @param {object} body Image body details
   * @returns {object} setState with image updated
   */
  handleProfileImg = (file, body) => {
    return resizeImage(file, body).then(blob => {
      return this.setState({
        profileImg: {
          src: URL.createObjectURL(blob),
          blob,
        },
      })
    })
  }

  /**
   * Update Profile Image via API
   */
  submitProfileImg = () => {
    const {user, loadUserData} = this.props
    const {profileImg} = this.state
    const userData = toFormData({image: profileImg.blob})
    this.setState({
      loadingImgUpload: true,
    })
    callApi('/user/profile/image/upload', userData, 'POST', user.token)
      .then(() => {
        loadUserData(false, true)
        this.toggleProfileImgUpload()
        this.props.showFeedback('Profile image updated successfully', 'success')
      })
      .catch(err => {
        if (Object.keys(err).length) {
          const {error} = err.data
          Object.keys(error).map(obj =>
            this.props.showFeedback(error[obj][0], 'error'),
          )
        } else {
          this.props.showFeedback(
            'Error updating profile image, please try again',
            'error',
          )
        }
      })
      .finally(() => {
        this.setState({
          loadingImgUpload: false,
        })
      })
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      address,
      city,
      cities,
      country,
      zipCode,
      referralUrl,
      loadingProfileUpdate,
      userDocument,
      userDocumentModal,
      loadingUpload,
      profileImg,
      profileImgModal,
      loadingImgUpload,
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
                      value: /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
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
                        dob: date[0],
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
                  options={cities}
                  value={city}
                  // value={cities ? cities.filter(cityDet => cityDet.label === city)[0] : ''}
                  className="location"
                  styles={customStyles}
                  placeholder="Select your city"
                  onChange={val =>
                    this.setState({
                      city: val,
                    })
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
                    this.setState({
                      country: val,
                    })
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
                onClick={this.toggleImgUpload}
              >
                Upload User Registration
              </Button>
              <Button
                color="blue"
                block
                className="mt-1 mb-5"
                onClick={this.toggleProfileImgUpload}
              >
                Upload Profile Image
              </Button>
              {/* Document upload */}
              <DocumentUpload
                userDocumentModal={userDocumentModal}
                userDocument={userDocument}
                specifyId={this.specifyId}
                toggleImgUpload={this.toggleImgUpload}
                handleUserDocument={this.handleUserDocument}
                submitUserDocument={this.submitUserDocument}
                loadingUpload={loadingUpload}
              />
              {/* Image upload */}
              <ImageUpload
                profileImgModal={profileImgModal}
                profileImg={profileImg}
                toggleProfileImgUpload={this.toggleProfileImgUpload}
                handleProfileImg={this.handleProfileImg}
                submitProfileImg={this.submitProfileImg}
                loadingImgUpload={loadingImgUpload}
              />
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

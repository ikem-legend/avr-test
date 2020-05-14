import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  Row,
  Col,
  CustomInput,
  Modal,
  ModalBody,
  Label,
  Button,
} from 'reactstrap'
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback,
} from 'availity-reactstrap-validation'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'
import PasswordLoader from '../../assets/images/spin-loader.gif'

class Security extends Component {
  constructor() {
    super()
    this.state = {
      twoFA: '',
      notifications: '',
      pwdModal: false,
      acctModal: false,
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.twofactorAuthStatus !== this.props.twofactorAuthStatus) {
      this.loadUserData()
    }
  }

  /**
   * Update local state with user data from parent component
   * @param {object} e Global event object
   */
  loadUserData = () => {
    const {twoFA, notifications} = this.props
    this.setState({
      twoFA,
      notifications,
    })
  }

  /**
   * Update notification or 2FA settings
   * @param {object} e Global event object
   */
  updateFields = e => {
    const {name, checked} = e.target
    const {user, updateUserData} = this.props
    this.setState(prevState => ({
      ...prevState,
      [name]: checked,
    }))
    if (name === 'twoFA') {
      const twoFactorStatus = {two_factor_auth: checked}
      callApi(
        '/user/two-factor-auth/status',
        twoFactorStatus,
        'POST',
        user.token,
      )
        .then(() => {
          updateUserData()
          this.props.showFeedback(
            'Two-factor setting successfully updated',
            'success',
          )
        })
        .catch(() => {
          updateUserData()
          this.props.showFeedback('Error updating Two-factor setting', 'error')
        })
    } else {
      const notificationStatus = {app_notification: checked}
      callApi(
        '/user/notification/status',
        notificationStatus,
        'POST',
        user.token,
      )
        .then(() => {
          updateUserData()
          this.props.showFeedback(
            'Notifications setting successfully updated',
            'success',
          )
        })
        .catch(() => {
          updateUserData()
          this.props.showFeedback(
            'Error updating Notifications setting',
            'error',
          )
        })
    }
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
   * Toggle password modal
   */
  togglePwdChange = () => {
    const {pwdModal} = this.state
    this.setState({
      pwdModal: !pwdModal,
    })
  }

  /**
   * Update user password in state
   * @param {object} e Global event object
   */
  updatePassword = e => {
    const {name, value} = e.target
    this.setState({
      [name]: value,
    })
  }

  /**
   * Change user password via API call
   */
  changePassword = () => {
    const {user} = this.props
    const {currentPassword, newPassword, confirmNewPassword} = this.state
    if (newPassword === confirmNewPassword) {
      this.setState({loadingPwdChange: true})
      const pwdData = {
        password: newPassword,
        password_current: currentPassword,
        password_confirmation: confirmNewPassword,
      }
      callApi('/auth/change/password', pwdData, 'POST', user.token)
        .then(() => {
          this.props.showFeedback('Password successfully updated', 'success')
        })
        .catch(err => {
          if (Object.keys(err).length) {
            const {error} = err.data
            Object.keys(error).map(obj =>
              this.props.showFeedback(error[obj][0], 'error'),
            )
          } else {
            this.props.showFeedback(
              'Error updating password, please try again',
              'error',
            )
          }
        })
        .finally(() => {
          this.setState({
            loadingPwdChange: false,
            pwdModal: false,
          })
        })
    } else {
      this.props.showFeedback(
        'Passwords do not match, please check and try again',
        'error',
      )
    }
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {twoFA, notifications} = this.props
    const {
      pwdModal,
      currentPassword,
      newPassword,
      confirmNewPassword,
      loadingPwdChange,
    } = this.state
    const externalPwdCloseBtn = (
      <button
        className="close"
        style={{position: 'absolute', top: '15px', right: '15px'}}
        onClick={this.togglePwdChange}
      >
        &times;
      </button>
    )
    return (
      <div className="mt-2">
        <Row>
          <Col md={12}>
            <h6 className="font-weight-bold">Two - Factor Authentication</h6>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={9}>
            <p className="mb-0">
              For added security, enable a two-step authentication
            </p>
            <p className="mb-0">
              Which will require a PIN when sent to your email or
            </p>
            <p className="mb-0">registered phone with Avenir</p>
          </Col>
          <Col md={3} className="d-flex align-items-center">
            <div>
              <CustomInput
                type="switch"
                id="twoFASwitch"
                name="twoFA"
                className="security-switch"
                onClick={this.updateFields}
                onChange={this.updateFields}
                checked={twoFA}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h6 className="font-weight-bold">Notifications</h6>
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            <p className="mb-0">For added security, enable notification</p>
            <p className="mb-0">
              Which will require a PIN when sent to your email or
            </p>
            <p>registered phone with Avenir</p>
          </Col>
          <Col md={3} className="d-flex align-items-center">
            <div>
              <CustomInput
                type="switch"
                id="notificationsSwitch"
                name="notifications"
                className="security-switch"
                onClick={this.updateFields}
                onChange={this.updateFields}
                checked={notifications}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h6 className="font-weight-bold">Change Password</h6>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <p className="mb-o">
              To change account password click{' '}
              <span
                className="setting-highlight"
                onClick={this.togglePwdChange}
                onKeyPress={this.togglePwdChange}
              >
                here
              </span>
            </p>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h6 className="font-weight-bold">Delete Account</h6>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <p className="mb-0">
              Deleting your account is irreversible and takes 3 - 5 days
            </p>
            <p className="mb-0">
              Ensure you have deleted all your funds from your wallet before
              this process
            </p>
            <p className="mb-o">
              To start deletion process click{' '}
              <span
                className="setting-highlight"
                onClick={this.togglePwdChange}
                onKeyPress={this.toggleAcctDelete}
              >
                here
              </span>
            </p>
          </Col>
        </Row>

        {/* Password modal */}
        <Modal
          isOpen={pwdModal}
          toggle={this.togglePwdChange}
          external={externalPwdCloseBtn}
          size="lg"
          centered
        >
          <ModalBody>
            <div className="text-center account-pages">
              <h4 className="setting-highlight mt-4">Change Password</h4>
              <AvForm className="row" onValidSubmit={this.changePassword}>
                <Col md={{offset: 2, size: 8}}>
                  <AvGroup className="float-container">
                    <Label for="currentPassword">Current Password</Label>
                    <AvInput
                      name="currentPassword"
                      type="password"
                      id="currentPassword"
                      onChange={this.updatePassword}
                      onFocus={this.activateField}
                      onBlur={this.deactivateField}
                      value={currentPassword}
                      validate={{
                        pattern: {
                          value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
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
                    <AvFeedback data-testid="currentPassword-error">
                      Password must contain at least 1 lowercase, 1 uppercase, 1
                      number and 8 characters
                    </AvFeedback>
                  </AvGroup>
                </Col>
                <Col md={{offset: 2, size: 8}}>
                  <AvGroup className="float-container">
                    <Label for="newPassword">New Password</Label>
                    <AvInput
                      name="newPassword"
                      type="password"
                      id="newPassword"
                      onChange={this.updatePassword}
                      onFocus={this.activateField}
                      onBlur={this.deactivateField}
                      value={newPassword}
                      validate={{
                        pattern: {
                          value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
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
                    <AvFeedback data-testid="newPassword-error">
                      Enter a new password
                    </AvFeedback>
                  </AvGroup>
                </Col>
                <Col md={{offset: 2, size: 8}}>
                  <AvGroup className="float-container">
                    <Label for="confirmNewPassword">Confirm Password</Label>
                    <AvInput
                      name="confirmNewPassword"
                      type="password"
                      id="confirmNewPassword"
                      onChange={this.updatePassword}
                      onFocus={this.activateField}
                      onBlur={this.deactivateField}
                      value={confirmNewPassword}
                      validate={{
                        pattern: {
                          value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
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
                    <AvFeedback data-testid="confirmNewPassword-error">
                      Passwords do not match
                    </AvFeedback>
                  </AvGroup>
                </Col>
                <Col md={{offset: 2, size: 8}}>
                  <Row>
                    <Col md={6}>
                      <Button
                        color="inv-gray"
                        className="mr-2 mt-4 mb-4"
                        block
                        onClick={this.toggleTopup}
                      >
                        Cancel
                      </Button>
                    </Col>
                    <Col md={6}>
                      {loadingPwdChange ? (
                        <img
                          src={PasswordLoader}
                          alt="loader"
                          style={{height: '40px', marginTop: '20px'}}
                        />
                      ) : (
                        <Button
                          color="inv-blue"
                          className="mt-4 mb-4"
                          block
                          onClick={this.changePassword}
                        >
                          Change Password
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Col>
              </AvForm>
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps, {showFeedback})(Security)

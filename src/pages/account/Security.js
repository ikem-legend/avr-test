import React, {Component} from 'react'
import {connect} from 'react-redux'
// import {Redirect} from 'react-router-dom'
import {
  Row,
  Col,
  CustomInput
} from 'reactstrap'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'

class Security  extends Component {
	constructor() {
		super()
		this.state = {
			twoFA: '',
			notifications: '',
		}
	}

  componentDidUpdate(prevProps) {
    if (prevProps.twofactorAuthStatus !== this.props.twofactorAuthStatus) {
      this.loadUserData()
    }
  }

  loadUserData = () => {
    const {twoFA, notifications} = this.props
    this.setState({
      twoFA,
      notifications
    });
  }

	updateFields = e => {
		const {name, checked} = e.target
    const {user, updateUserData} = this.props
		this.setState((prevState) => ({
			...prevState,
			[name]: checked
		}));
    if (name === 'twoFA') {
      const twoFactorStatus = {two_factor_auth: checked}
      callApi('/user/two-factor-auth/status', twoFactorStatus, 'POST', user.token)
        .then(() => {
          updateUserData()
          this.props.showFeedback('Two-factor setting successfully updated', 'success')
        })
        .catch(() => {
          updateUserData()
          this.props.showFeedback('Error updating Two-factor setting', 'error')
        })
      } else {
        const notificationStatus = {app_notification: checked}
        callApi('/user/notification/status', notificationStatus, 'POST', user.token)
          .then(() => {
            updateUserData()
            this.props.showFeedback('Notifications setting successfully updated', 'success')
          })
          .catch(() => {
            updateUserData()
            this.props.showFeedback('Error updating Notifications setting', 'error')
          })
    }
	}

	render() {
		const {twoFA, notifications} = this.props
		return (
      <div className="mt-2">
        <Row>
          <Col md={12}>
            <h6 className="font-weight-bold">Two - Factor Authentication</h6>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={9}>
            <p className="mb-0">For added security, enable a two-step authentication</p>
            <p className="mb-0">Which will require a PIN when sent to your email or</p>
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
            <p className="mb-0">Which will require a PIN when sent to your email or</p>
            <p className="mb-0">registered phone with Avenir</p>
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
      </div>
		)
	}
}

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps, {showFeedback})(Security)
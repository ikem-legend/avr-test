import React, {Component} from 'react'
import {connect} from 'react-redux'
// import {Redirect} from 'react-router-dom'
import {
  Row,
  Col,
  CustomInput
} from 'reactstrap'

class Security  extends Component {
	constructor() {
		super()
		this.state = {
			name: '',
			email: '',
			phone: '',
			dob: '',
			address: '',
			referralUrl: ''
		}
	}

  // componentDidMount() {
  //   const {user} = this.props
  //   console.log(user)
  //   this.setState({
  //     name: `${user.myFirstName} ${user.myLastName}`,
  //     email: user.myEmailAddress,
  //     phone: user.myPhoneNumber,
  //     dob: '',
  //     address: 'Sample address',
  //     referralUrl: ''
  //   });
  // }

	updateFields = e => {
		const {name, value} = e.target
		this.setState((prevState) => ({
			...prevState,
			[name]: [value]
		}));
	}

	render() {
		// const {name, email, phone, dob, address, referralUrl} = this.state
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
              <span className="mr-1 font-weight-bold">PAUSE</span>
              <CustomInput 
                type="switch"
                id="roundupsSwitch"
                name="roundupsSwitch"
                className="roundup-switch"
                label="RESUME"
                onClick={this.switchRoundup}
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
              <span className="mr-1 font-weight-bold">PAUSE</span>
              <CustomInput 
                type="switch"
                id="roundupsSwitch"
                name="roundupsSwitch"
                className="roundup-switch"
                label="RESUME"
                onClick={this.switchRoundup}
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

export default connect(mapStateToProps)(Security)
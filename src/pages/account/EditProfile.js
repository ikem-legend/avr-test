import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import subYears from 'date-fns/subYears'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'
import SaveLoader from '../../assets/images/spin-loader.gif'

class EditProfile extends Component {
	constructor() {
		super()
		this.state = {
			name: '',
			email: '',
			phone: '',
			dob: '',
			address: '',
			referralUrl: '',
			loadingProfileUpdate: false
		}
	}

	updateFields = e => {
		const {name, value} = e.target
		// Update validation logic
		this.setState((prevState) => ({
			...prevState,
			[name]: value
		}));
	}

	componentDidUpdate(prevProps) {
		if (this.props.name.length > prevProps.name.length) {
			this.getProfileDetails()
		}
	}

	getProfileDetails = () => {
		const {name, dob, phone, email, address, zipCode, referralUrl} = this.props
		this.setState({
			name,
			email,
			phone,
			dob,
			address,
			zipCode,
			referralUrl
		});
	}

  updateProfile = () => {
    const {name, dob, phone, email, address, zipCode, referralUrl} = this.state
    const {loadUserData} = this.props
    const [first_name, last_name] = String(name).split(' ')
    const userData = {first_name, last_name, email, phone, dob, address, zip_code: zipCode, identifier: referralUrl}
    this.setState({
    	loadingProfileUpdate: true
    });
    callApi('/user/profile/update', userData, 'POST', this.props.user.token)
      .then(() => {
        loadUserData()
        this.props.showFeedback('Profile updated successfully', 'success')
      })
      .catch(() => {
        this.props.showFeedback('Error updating profile, please try again', 'error')
      })
      .finally(() => {
      	this.setState({
		    	loadingProfileUpdate: false
		    });
      })
  }

	render() {
		const {name, email, phone, dob, address, zipCode, referralUrl, loadingProfileUpdate} = this.state
		return (
			<Row>
				<Col>
					<Form>
						<FormGroup>
							<label htmlFor="name">Full Name</label>
							<Input type="text" name="name" value={name} onChange={this.updateFields} />
						</FormGroup>
						<FormGroup>
							<label htmlFor="email">Email address</label>
							<Input type="text" name="email" value={email} onChange={this.updateFields} />
						</FormGroup>
						<FormGroup>
							<label htmlFor="phone">Phone Number</label>
							<Input type="text" name="phone" value={phone} onChange={this.updateFields} />
						</FormGroup>
						<FormGroup>
							<label htmlFor="date of birth">Date of Birth</label>
							<Flatpickr
                name="dob"
                value={dob}
                onChange={date =>
                  this.setState(prevState => ({
                    ...prevState,
                    dob: date
                  }))
                }
                className="form-control"
                options={{
                  maxDate: subYears(new Date(), 18),
                  defaultDate: dob,
                  dateFormat: 'm-d-Y',
                }}
              />
						</FormGroup>
						<FormGroup>
							<label htmlFor="home address">Home Address</label>
							<Input type="text" name="address" value={address} onChange={this.updateFields} />
						</FormGroup>
						<FormGroup>
							<label htmlFor="zipCode">Zipcode</label>
							<Input type="text" name="zipCode" value={zipCode} onChange={this.updateFields} />
						</FormGroup>
						<FormGroup>
							<label htmlFor="referral link">Referral Custom URL <span className="text-muted font-size-12">(This can only be changed once)</span></label> 
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>https://avenir-app.com/r/</InputGroupText>
                </InputGroupAddon>
                <Input type="text" name="referralUrl" value={referralUrl} onChange={this.updateFields} readOnly={Boolean(referralUrl)} />
              </InputGroup>
						</FormGroup>
            <Row>
              <Col md={{size: 2, offset: 10}}>
              	{loadingProfileUpdate ? (
                  <img
                    src={SaveLoader}
                    alt="loader"
                    style={{height: '40px'}}
                  />
                ) : (
                	<Button color="red" block onClick={this.updateProfile}>Save</Button>
                )}
              </Col>
            </Row>
					</Form>
				</Col>
			</Row>
		)
	}
}

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps, {showFeedback})(EditProfile)
import React, {Component} from 'react'
import {connect} from 'react-redux'
// import {Redirect} from 'react-router-dom'
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

class EditProfile  extends Component {
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

  componentDidMount() {
    const {user} = this.props
    console.log(user)
    this.setState({
      name: `${user.myFirstName} ${user.myLastName}`,
      email: user.myEmailAddress,
      phone: user.myPhoneNumber ? user.myPhoneNumber : '',
      dob: '',
      address: 'Sample address',
      referralUrl: ''
    });
  }

	updateFields = e => {
		const {name, value} = e.target
		this.setState((prevState) => ({
			...prevState,
			[name]: [value]
		}));
	}

	render() {
		const {name, email, phone, dob, address, referralUrl} = this.state
		return (
			<Row>
				<Col>
					<Form>
						<FormGroup>
							<label htmlFor="name">Full Name</label>
							<Input type="text" value={name} onChange={this.updateFields} />
						</FormGroup>
						<FormGroup>
							<label htmlFor="email">Email address</label>
							<Input type="text" value={email} onChange={this.updateFields} />
						</FormGroup>
						<FormGroup>
							<label htmlFor="phone">Phone Number</label>
							<Input type="text" value={phone} onChange={this.updateFields} />
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
                  maxDate: new Date('2004-01-01'),
                  defaultDate: dob,
                  dateFormat: 'd-M-Y',
                }}
              />
						</FormGroup>
						<FormGroup>
							<label htmlFor="home address">Home Address</label>
							 <Input type="text" value={address} onChange={this.updateFields} />
						</FormGroup>
						<FormGroup>
							<label htmlFor="referral link">Referral Custom URL <span className="text-muted font-size-12">(This can only be changed once)</span></label> 
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>https://avenir-app.com</InputGroupText>
                </InputGroupAddon>
                <Input type="text" value={referralUrl} onChange={this.updateFields} />
              </InputGroup>
						</FormGroup>
            <Row>
              <Col md={{size:2, offset: 10}}>
                <Button color="red" className="" block>Save</Button>
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

export default connect(mapStateToProps)(EditProfile)
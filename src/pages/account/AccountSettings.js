import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
// import {Redirect} from 'react-router-dom'
import {
  Row,
  Col,
  CustomInput,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from 'reactstrap'
import classnames from 'classnames'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'

class AccountSettings extends Component {
	constructor() {
		super()
		this.state = {
			multiplier: '2x',
			// email: '',
			// phone: '',
			// dob: '',
			// address: '',
			// referralUrl: ''
		}
	}

  switchRoundup = e => {
    const {value} = e.target
    console.log(value)
    // this.props.showFeedback('Roundup successfully saved', 'success')
  }

  selectMultiplier = e => {
    // const {showFeedback} = this.props
    const {value} = e.target
    console.log(value)
    // this.props.showFeedback('Multiplier successfully saved', 'success')
    this.setState({
      multiplier: value,
    })
  }

  saveMultiplier = () => {
    const {multiplier} = this.state
    const {user} = this.props
    // console.log(user)
    const intMultiplier = String(parseInt(multiplier, 10))
    console.log(intMultiplier)
    // console.log(typeof(intMultiplier))
    // Only allow for 1x, 2x, 5x, 10x
    const multiplierObj = {multiplier_id: intMultiplier}
    callApi('/user/multiplier', multiplierObj, 'POST', user.token)
      .then(result => {
        console.log(result)
        this.props.showFeedback('Multiplier successfully saved', 'success')
      })
      .catch(err => {
        console.log(err)
      })
  }

	render() {
    const {multiplier} = this.state
		return (
      <Fragment>
  			<Row>
  				<Col md={12}>
  					<h6 className="font-weight-bold">Round-Up Investment</h6>
            <div className="roundup-milestone">
              <Form>
                <FormGroup row className="mt-4">
                    <span>PAUSE </span>
                    <CustomInput 
                      type="switch"
                      id="roundupsSwitch"
                      name="roundupsSwitch"
                      label="RESUME"
                      onClick={this.switchRoundup}
                    />
                </FormGroup>
              </Form>
              <div>
                <p>You can pause your round-up investing at any time. This will disable all Avenir round-up investments</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form>
              <Row>
                <Col md={2}>
                  <FormGroup>
                    <div className="">
                      <Button
                        color="none"
                        value="1x"
                        onClick={this.selectMultiplier}
                        className={classnames({
                          'btn-deep-blue': multiplier === '1x',
                          'btn-light-blue': multiplier !== '1x',
                        })}
                      >
                        1x
                      </Button>
                    </div>
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <div className="">
                      <Button
                        color="none"
                        value="2x"
                        onClick={this.selectMultiplier}
                        className={classnames({
                          'btn-deep-blue': multiplier === '2x',
                          'btn-light-blue': multiplier !== '2x',
                        })}
                      >
                        2x
                      </Button>
                    </div>
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <div className="">
                      <Button
                        color="none"
                        value="5x"
                        onClick={this.selectMultiplier}
                        className={classnames({
                          'btn-deep-blue': multiplier === '5x',
                          'btn-light-blue': multiplier !== '5x',
                        })}
                      >
                        5x
                      </Button>
                    </div>
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <div className="">
                      <Button
                        color="none"
                        value="10x"
                        onClick={this.selectMultiplier}
                        className={classnames({
                          'btn-deep-blue': multiplier === '10x',
                          'btn-light-blue': multiplier !== '10x',
                        })}
                      >
                        10x
                      </Button>
                    </div>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Button
                      color="deep-ash block"
                      onClick={this.saveMultiplier}
                    >
                      SAVE
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Fragment>
		)
	}
}

const mapStateToProps = state => ({
	user: state.Auth.user
})

export default connect(mapStateToProps, {showFeedback})(AccountSettings)
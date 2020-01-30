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
  Button
} from 'reactstrap'
import classnames from 'classnames'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'
import btcImg from '../../assets/images/layouts/btc.svg'
import ethImg from '../../assets/images/layouts/eth.svg'

class AccountSettings extends Component {
	constructor() {
		super()
		this.state = {
			multiplier: '2x',
			btc: 50,
			eth: 50,
			// dob: '',
			// address: '',
			// referralUrl: ''
		}
	}

  switchRoundup = e => {
    const {value} = e.target
    console.log(value)
    // this.props.showFeedback('Roundup successfully saved', 'success' 
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

  updateRatio = e => {
    const {name, value} = e.target
    if (name === 'btc') {
      this.setState({
        btc: parseInt(value, 10),
        eth: parseInt(100 - value, 10)
      });
    } else {
      this.setState({
        btc: parseInt(100 - value, 10),
        eth: parseInt(value, 10)
      });
    }
  }

	render() {
    const {multiplier, btc, eth} = this.state
		return (
      <Fragment>
  			<Row>
  				<Col md={12}>
  					<h6 className="font-weight-bold">Round-Up Investment</h6>
            <div className="roundup-milestone">
              <Form>
                <FormGroup row className="mt-4">
                  <Col>
                    <span>PAUSE</span>
                    <CustomInput 
                      type="switch"
                      id="roundupsSwitch"
                      name="roundupsSwitch"
                      className="roundup-switch"
                      label="RESUME"
                      onClick={this.switchRoundup}
                    />
                  </Col>
                </FormGroup>
              </Form>
              <div>
                <p className="mb-1">You can pause your round-up investing at any time.</p>
                <p>This will disable all Avenir round-up investments</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="mb-2">
            <h5 className="font-weight-bold">Your round-up multiplier is currently set to <span className="multiplier">2x</span></h5>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form>
              <Row>
                <Col md={1}>
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
                <Col md={1}>
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
                <Col md={1}>
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
                <Col md={1}>
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
            <p className="mb-1">Multiply your round-up amount to acceleratre your</p>
            <p className="mb-2">investments. Eg: $0.10 in round-ups will be $0.20 with 2x</p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h6 className="font-weight-bold">Investment Distribution Settings</h6>
            <p className="mb-1">Manage your investment across various cryptocurrencies.</p>
            <p className="mb-1">Easily adjust your ratio to suit your preference.</p>
            <p className="font-weight-bold">Your Bitcoin to Ethereum % ratio is <span className="inv-ratio">50% : 50%</span></p>
          </Col>
        </Row>
        <Row form>
          <Col md={12}>
            <span className="edit-ratio">Edit crypto investment ratio below</span>
            <Row>
              <Col md={6}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend" className="font-weight-bold text-center"> 
                    <InputGroupText><img src={btcImg} alt="Bitcoin" className="invCoin mr-1" /> Bitcoin</InputGroupText>
                  </InputGroupAddon>
                  <Input type="number" name="btc" value={btc} onChange={this.updateRatio} min="0" max="100" />
                </InputGroup>
              </Col>
              <Col md={6}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend" className="font-weight-bold text-center"> 
                    <InputGroupText><img src={ethImg} alt="Ethereum" className="invCoin mr-1" /> Ethereum</InputGroupText>
                  </InputGroupAddon>
                  <Input type="number" name="eth" value={eth} onChange={this.updateRatio} min="0" max="100" />
                </InputGroup>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={{size:2, offset: 10}}>
                <Button color="red" className="" block>Save</Button>
              </Col>
            </Row>
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
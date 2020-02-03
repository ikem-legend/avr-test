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
import Loader from '../../components/Loader'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'
import btcImg from '../../assets/images/layouts/btc.svg'
import ethImg from '../../assets/images/layouts/eth.svg'

class AccountSettings extends Component {
	constructor() {
		super()
		this.state = {
			multiplier: '2',
			btc: 50,
			eth: 50,
			invPause: false,
			loading: '',
			currDist: {}
		}
	}

  componentDidMount() {
    this.loadUserData()
  }

  
  loadUserData = () => {
    const {user} = this.props
    callApi('/auth/me', null, 'GET', user.token)
      .then(res => {
        // console.log(res)
        const {MyInvestmentPause, myMultiplierSetting, myCurrencyDistributions} = res.data
        const multiplierList = {1: '1', 2: '2', 3: '5', 4: '10'}
        const btcVal = myCurrencyDistributions[0].percentage
        const ethVal = myCurrencyDistributions[1].percentage
        this.setState({
          multiplier: multiplierList[myMultiplierSetting],
          invPause: MyInvestmentPause,
          btc: btcVal,
          eth: ethVal,
          currDist: {btc: btcVal, eth: ethVal}
        });
      })
      .catch(err => {
        console.log(err)
        this.props.showFeedback('Error retrieving user details. Please try again', 'error')
      })
  }

  switchRoundup = e => {
    const {checked} = e.target
    const {user} = this.props
    this.setState({
      invPause: !checked,
      loading: true
    });
    if (checked) {
      callApi('/user/investment/continue', null, 'GET', user.token)
        .then(() => {
          this.setState({
            loading: false
          });
          this.props.showFeedback('Round-up successfully updated', 'success')
        })
        .catch(() => {
          this.setState({
            loading: false
          });
          this.props.showFeedback('Error updating round-up', 'error')
        })
    } else {
      callApi('/user/investment/pause', null, 'GET', user.token)
        .then(() => {
          this.setState({
            loading: false
          });
          this.props.showFeedback('Round-up successfully updated', 'success')
        })
        .catch(() => {
          this.setState({
            loading: false
          });
          this.props.showFeedback('Error updating round-up', 'error')
        })
    }
  }

  selectMultiplier = e => {
    const {value} = e.target
    this.setState({
      multiplier: value
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

  saveMultiplier = () => {
    const {multiplier} = this.state
    const {user} = this.props
    // console.log(user)
    const multiplierList = {1: '1', 2: '2', 3: '5', 4: '10'}
    const selectedMultiplierId = Object.keys(multiplierList).find(key => 
      multiplierList[key] === String(parseInt(multiplier, 10))
    )
    this.setState({
      loading: true
    });
    const multiplierObj = {'multiplier': selectedMultiplierId}
    // console.log(multiplierObj)
    callApi('/user/multipliers', multiplierObj, 'POST', user.token)
      .then(() => {
        this.props.showFeedback('Multiplier successfully updated', 'success')
        this.saveRatio()
      })
      .catch(err => {
        console.log(err)
        this.setState({
          loading: false
        });
        this.props.showFeedback('Error updating currency ratio, please try again')
      })
  }

  saveRatio = () => {
    const {btc, eth} = this.state
    const {user} = this.props
    // Created temporarily
    const currArray = [{id: 2, percentage: btc}, {id: 3, percentage: eth}]
    const currObj = {currencies: currArray}
    callApi('/user/distributions', currObj, 'POST', user.token)
      .then(() => {
        this.props.showFeedback('Currency ratio successfully updated', 'success')
        this.setState({
          loading: false,
          currDist: {btc, eth}
        });
      })
      .catch(() => {
        this.props.showFeedback('Error updating currency ratio, please try again')
        this.setState({
          loading: false
        });
      })
  }

	render() {
    const {multiplier, btc, eth, currDist, invPause, loading} = this.state
		return (
      <Fragment>
  			<Row>
  				<Col md={12}>
  					<h6 className="font-weight-bold">Round-Up Investment</h6>
            <div className="roundup-milestone">
              { loading ? 
                <Loader /> : 
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
                        checked={!invPause}
                        onChange={this.switchRoundup}
                      />
                    </Col>
                  </FormGroup>
                </Form>
              }
              <div>
                <p className="mb-1">You can pause your round-up investing at any time.</p>
                <p>This will disable all Avenir round-up investments</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="mb-2">
            <h5 className="font-weight-bold">Your round-up multiplier is currently set to <span className="multiplier">{multiplier}x</span></h5>
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
                        value="1"
                        onClick={this.selectMultiplier}
                        className={classnames({
                          'btn-deep-blue': multiplier === '1',
                          'btn-light-blue': multiplier !== '1',
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
                        value="2"
                        onClick={this.selectMultiplier}
                        className={classnames({
                          'btn-deep-blue': multiplier === '2',
                          'btn-light-blue': multiplier !== '2',
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
                        value="5"
                        onClick={this.selectMultiplier}
                        className={classnames({
                          'btn-deep-blue': multiplier === '5',
                          'btn-light-blue': multiplier !== '5',
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
                        value="10"
                        onClick={this.selectMultiplier}
                        className={classnames({
                          'btn-deep-blue': multiplier === '10',
                          'btn-light-blue': multiplier !== '10',
                        })}
                      >
                        10x
                      </Button>
                    </div>
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
            <p className="font-weight-bold">Your Bitcoin to Ethereum % ratio is <span className="inv-ratio">{currDist.btc}% : {currDist.eth}%</span></p>
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
                <Button color="red" block onClick={this.saveMultiplier}>Save</Button>
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
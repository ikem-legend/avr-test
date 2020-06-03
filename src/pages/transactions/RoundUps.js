import React, {Component} from 'react'
import {
  Row,
  Col,
  Form,
  FormGroup,
  CustomInput,
  Button,
  Progress,
} from 'reactstrap'
import classnames from 'classnames'

import Loader from '../../assets/images/spin-loader-grey.gif'
import {callApi} from '../../helpers/api'

class RoundUps extends Component {
  constructor() {
    super()
    this.state = {
      multiplier: '1', // text value of multiplier
      milestone: 0,
      milestoneAmount: '0.00',
      invPause: false,
      loadingRndp: false,
      loadingMlpr: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.multiplier !== this.props.multiplier) {
      this.loadUserData()
    }
    if (prevProps.milestone.length !== this.props.milestone.length) {
      this.loadTxnData()
    }
  }

  /**
   * Load local state with user data
   */
  loadUserData = () => {
    const {multiplier, invPause} = this.props
    this.setState({
      multiplier,
      invPause,
    })
  }

  /**
   * Load local state with transaction data
   */
  loadTxnData = () => {
    const {milestone} = this.props
    const userMilestone =
      milestone && milestone.length ? parseFloat(milestone[0].amount, 10) : 0
    let milestoneProgress, result
    if (userMilestone > 0) {
      result = (userMilestone * 100) / 5
      milestoneProgress = result > 100 ? 100 : result
    }
    this.setState({
      milestone: milestoneProgress,
      milestoneAmount:
        milestone && milestone.length ? milestone[0].amount : '0.00',
    })
  }

  /**
   * Update roundup state locally and via API
   * @param {object} e Global event object
   */
  switchRoundup = e => {
    const {checked} = e.target
    const {user} = this.props
    this.setState({
      invPause: !checked,
      loadingRndp: true,
    })
    const invStatus = {
      pause_investment: !checked,
    }
    callApi('/user/investment/status', invStatus, 'POST', user.token)
      .then(() => {
        this.setState({
          invPause: !checked,
          loadingRndp: false,
        })
        this.props.showFeedback('Round-up successfully updated', 'success')
      })
      .catch(() => {
        this.setState({
          loadingRndp: false,
          invPause: checked,
        })
        this.props.showFeedback(
          'Error updating round-up. Please try again',
          'error',
        )
      })
  }

  /**
   * Update multiplier local state
   * @param {object} e Global event object
   */
  selectMultiplier = e => {
    const {value} = e.target
    this.setState({
      multiplier: value,
    })
  }

  /**
   * Update multiplier setting via API
   */
  saveMultiplier = () => {
    const {multiplier} = this.state
    const {user, dataUpdate} = this.props
    const multiplierList = {1: '1', 2: '2', 3: '5', 4: '10'}
    const selectedMultiplierId = Object.keys(multiplierList).find(
      key => multiplierList[key] === String(parseInt(multiplier, 10)),
    )
    this.setState({
      loadingMlpr: true,
    })
    const multiplierObj = {multiplier: selectedMultiplierId}
    callApi('/user/multipliers', multiplierObj, 'POST', user.token)
      .then(() => {
        // Update sidebar value on first multiplier update
        if (user.setup.multiplierSetup.done === false) {
          dataUpdate(true)
        } else {
          dataUpdate()
        }
        this.setState({
          multiplier,
          loadingMlpr: false,
        })
        this.props.showFeedback('Multiplier successfully updated', 'success')
      })
      .catch(err => {
        console.log(err)
        this.setState({
          loadingMlpr: false,
        })
        this.props.showFeedback(
          'Error saving multiplier, please try again',
          'error',
        )
      })
  }

  render() {
    const {
      multiplier,
      milestone,
      milestoneAmount,
      invPause,
      loadingRndp,
      loadingMlpr,
    } = this.state
    return (
      <Row>
        {/* milestone */}
        <Col md={7}>
          <Row>
            <Col md={8}>
              <h1 className="mb-1">Round-Up Milestone</h1>
            </Col>
            <Col md={4}>
              <div className="roundup-milestone mt-4">
                <Form>
                  <FormGroup row>
                    <span className="font-weight-bold">PAUSE </span>
                    <span> </span>
                    {loadingRndp ? (
                      <img src={Loader} alt="loader" style={{height: '40px'}} />
                    ) : (
                      <CustomInput
                        type="switch"
                        id="roundupsSwitch"
                        className="roundups-switch"
                        name="roundupsSwitch"
                        label="RESUME"
                        checked={!invPause}
                        onChange={this.switchRoundup}
                      />
                    )}
                  </FormGroup>
                </Form>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Progress value={milestone} color="blue" className="roundup-bar">
                ${milestoneAmount} Roundup ({milestone}%)
              </Progress>
            </Col>
          </Row>
        </Col>
        {/* multipliers */}
        <Col md={5}>
          <p>
            Multiply your roundup amount to accelerate your investments. Eg:
            $0.10 in round-ups will be $0.20 in 2x
          </p>
          <Row>
            <Col md={12}>
              <Form>
                <Row>
                  <Col md={2}>
                    <FormGroup>
                      <div>
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
                  <Col md={2}>
                    <FormGroup>
                      <div>
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
                  <Col md={2}>
                    <FormGroup>
                      <div>
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
                  <Col md={2}>
                    <FormGroup>
                      <div>
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
                  <Col md={4}>
                    {loadingMlpr ? (
                      <img src={Loader} alt="loader" style={{height: '40px'}} />
                    ) : (
                      <FormGroup>
                        <Button
                          color="deep-ash block"
                          onClick={this.saveMultiplier}
                        >
                          SAVE
                        </Button>
                      </FormGroup>
                    )}
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default RoundUps

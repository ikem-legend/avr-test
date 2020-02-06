import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {
  Row,
  Col,
  Form,
  FormGroup,
  CustomInput,
  // Label,
  // Input,
  Button,
  Progress,
} from 'reactstrap'
import classnames from 'classnames'

import Loader from '../../components/Loader'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'

class RoundUps extends Component {
  constructor() {
    super()
    this.state = {
      multiplier: '2',
      invPause: false,
      loading: false
    }
  }

  componentDidMount() {
    this.loadUserData()
  }

  loadUserData = () => {
    const {user} = this.props
    callApi('/auth/me', null, 'GET', user.token)
      .then(res => {
        const {myMultiplierSetting, MyInvestmentPause} = res.data
        const multiplierList = {1: '1', 2: '2', 3: '5', 4: '10'}
        this.setState({
          multiplier: multiplierList[myMultiplierSetting],
          invPause: MyInvestmentPause,
        })
      })
      .catch(err => {
        console.log(err)
        this.props.showFeedback(err, 'error')
        // this.props.history.push('/account/login')
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
    const multiplierObj = {multiplier: selectedMultiplierId}
    callApi('/user/multipliers', multiplierObj, 'POST', user.token)
      .then(result => {
        console.log(result)
        this.loadUserData()
        this.setState({
          loading: false
        });
        this.props.showFeedback(
          'Multiplier successfully updated', 
          'success'
        )
      })
      .catch(err => {
        console.log(err)
        this.setState({
          loading: false
        });
        this.props.showFeedback(
          'Error saving multiplier, please try again',
          'error',
        )
      })
  }

  render() {
    const {multiplier, invPause, loading} = this.state
    return (
      <Fragment>
        {/* preloader */}
        {this.props.loading && <Loader />}

        <Row>
          {/* milestone */}
          <Col md={7}>
            <Row>
              <Col md={8}>
                <h1 className="mb-1">Round-Up Milestone</h1>
              </Col>
              <Col md={4}>
                <div className="roundup-milestone mt-4">
                  { loading ? 
                    <Loader /> : 
                    <Form>
                      <FormGroup row>
                        <span className="font-weight-bold">PAUSE </span>
                        <span> </span>
                        <CustomInput
                          type="switch"
                          id="roundupsSwitch"
                          name="roundupsSwitch"
                          label="RESUME"
                          checked={!invPause}
                          onChange={this.switchRoundup}
                        />
                      </FormGroup>
                    </Form>
                  }
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <Progress value="52" color="blue" className="roundup-bar">
                  $2.60 Roundup (52%)
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
                      { loading ? 
                        <Loader /> :
                        <FormGroup>
                          <Button
                            color="deep-ash block"
                            onClick={this.saveMultiplier}
                          >
                            SAVE
                          </Button>
                        </FormGroup>
                      }
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps, {showFeedback})(withRouter(RoundUps))

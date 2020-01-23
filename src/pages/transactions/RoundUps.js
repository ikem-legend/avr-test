import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
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
import {Cookies} from 'react-cookie'
import classnames from 'classnames'

import Loader from '../../components/Loader'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'

class RoundUps extends Component {
  constructor() {
    super()
    this.state = {
      multiplier: '2x'
    }
  }

  switchRoundup = e => {
    const {value} = e.target
    console.log(value)
    showFeedback('Roundup successfully saved', 'success')
  }

  selectMultiplier = e => {
    // const {showFeedback} = this.props
    const {value} = e.target
    // console.log(value)
    showFeedback('Multiplier successfully saved', 'success')
    this.setState({
      multiplier: value
    });
  }

  saveMultiplier = () => {
    const {multiplier} = this.state
    const cookies = new Cookies()
    const appUser =  cookies.get('avenirUser')

    // console.log(appUser)
    const intMultiplier = String(parseInt(multiplier, 10))
    console.log(intMultiplier)
    console.log(typeof(intMultiplier))
    // Only allow for 1x, 2x, 5x, 10x
    callApi('/user/multiplier', multiplier, 'POST', appUser.token)
      .then(result => {
        console.log(result)
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const {multiplier} = this.state
    return (
      <Fragment>
        {/* preloader */}
        {this.props.loading && <Loader />}

        <Row>
          {/* milestone */}
          <Col md={6}>
            <Row>
              <Col md={8}>
                <h4>Round-Up Milestone</h4>
              </Col>
              <Col md={4} className="roundup-milestone">
                <Form>
                  <FormGroup row>
                    <span>PAUSE </span><span> </span>
                    <CustomInput
                      type="switch"
                      id="roundupsSwitch"
                      name="roundupsSwitch"
                      label="RESUME"
                      onClick={this.switchRoundup}
                    />
                  </FormGroup>
                </Form>
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
          <Col md={6}>
            <p>
              Multiply your roundup amount to accelerate your investments. Eg:
              $0.10 in round-ups will be $0.20 in 2x
            </p>
            <Row>
              <Col md={12}>
                <Form>
                  <FormGroup check inline>
                    <Col md={2}>
                      <div className="">
                        <Button color="none" value="1x" onClick={this.selectMultiplier} className={classnames({'btn-deep-blue': multiplier === '1x', 'btn-light-blue': multiplier !== '1x'})}>1x</Button>
                      </div>
                    </Col>
                    <Col md={2}>
                      <div className="">
                        <Button color="none" value="2x" onClick={this.selectMultiplier} className={classnames({'btn-deep-blue': multiplier === '2x', 'btn-light-blue': multiplier !== '2x'})}>2x</Button>
                      </div>
                    </Col>
                    <Col md={2}>
                      <div className="">
                        <Button color="none" value="5x" onClick={this.selectMultiplier} className={classnames({'btn-deep-blue': multiplier === '5x', 'btn-light-blue': multiplier !== '5x'})}>5x</Button>
                      </div>
                    </Col>
                    <Col md={2}>
                      <div className="">
                        <Button color="none" value="10x" onClick={this.selectMultiplier} className={classnames({'btn-deep-blue': multiplier === '10x', 'btn-light-blue': multiplier !== '10x'})}>10x</Button>
                      </div>
                    </Col>
                    <Col md={4}>
                      <Button color="deep-blue block" onClick={this.saveMultiplier}>SAVE MULTIPLIER</Button>
                    </Col>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

// const mapDispatchToProps = state => ({
//   showFeedback
// })

export default connect(null, {showFeedback})(RoundUps)

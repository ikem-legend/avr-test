import React, {Component, Fragment} from 'react'
import {Redirect} from 'react-router-dom'
import {
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  CustomInput,
  Button,
  Progress,
} from 'reactstrap'

import {isUserAuthenticated} from '../../helpers/authUtils'
// import { getLoggedInUser, isUserAuthenticated } from '../../helpers/authUtils'
import Loader from '../../components/Loader'
import TopUp from '../../assets/images/topups.svg'

import TransactionTables from './TransactionTables'
// import RevenueChart from './RevenueChart'
// import InvestmentChart from './InvestmentChart'

class Transactions extends Component {
  constructor(props) {
    super(props)

    this.state = {
      roundup: '',
      // user: getLoggedInUser(),
    }
  }

  updateValue = e => {
    this.setState({
      roundup: e.target.value,
    })
  }

  /**
   * Redirect to root
   * @returns {object} Redirect component
   */
  renderRedirectToRoot = () => {
    const isAuthTokenValid = isUserAuthenticated()
    if (!isAuthTokenValid) {
      return <Redirect to="/account/login" />
    }
  }

  render() {
    const {roundup} = this.state

    return (
      <Fragment>
        {this.renderRedirectToRoot()}
        <div className="">
          {/* preloader */}
          {this.props.loading && <Loader />}

          <Row className="page-title align-items-center">
            <Col sm={4}>
              <p className="mb-1 mt-1 text-muted">
                Avenir rounds up your everyday credit card purchases to the
                nearest dollar and invests the nearest cents
              </p>
            </Col>
            <Col sm={8}>
              <div className="mb-1 mt-1 top-up">
                <Row>
                  <Col md={6}>
                    <img src={TopUp} alt="Top-up" />
                  </Col>
                  <Col md={3}>
                    <h6 className="top-heading">Top Up</h6>
                    <p>Top-Ups are an easy way to make one-time investments</p>
                  </Col>
                  <Col md={3}>
                    <Form>
                      <FormGroup>
                        <Input
                          type="text"
                          name="roundup"
                          placeholder="Enter Amount"
                          value={roundup}
                          onChange={this.updateValue}
                        />
                      </FormGroup>
                      <Button color="red" className="mt-1" sm>
                        Invest Now
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row>
            {/* milestone */}
            <Col md={8}>
              <Row>
                <Col md={8}>
                  <h4>Round-Up Milestone</h4>
                </Col>
                <Col md={4}>
                  <FormGroup row>
                    <span>Pause </span>
                    <CustomInput
                      type="switch"
                      id="roundupsSwitch"
                      name="roundupsSwitch"
                      label="Resume"
                    />
                  </FormGroup>
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
            <Col md={4}>
              <p>
                Multiply your roundup amount to accelerate your investments. Eg:
                $0.10 in round-ups will be $0.20 in 2x
              </p>
              <Row>
                <Col>
                  <Button color="light-blue">1x</Button>
                </Col>
                <Col>
                  <Button color="deep-blue">2x</Button>
                </Col>
                <Col>
                  <Button color="light-blue">5x</Button>
                </Col>
                <Col>
                  <Button color="light-blue">10x</Button>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* table */}
          <Row className="mt-4 mb-4">
            <TransactionTables />
          </Row>
        </div>
      </Fragment>
    )
  }
}

export default Transactions

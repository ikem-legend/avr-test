import React, {Component, Fragment} from 'react'
import {Redirect} from 'react-router-dom'
import {
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  TabPane,
  TabContent,
   Nav, 
   NavItem, 
   NavLink
} from 'reactstrap'
import classnames from 'classnames'

import {isUserAuthenticated} from '../../helpers/authUtils'
// import { getLoggedInUser, isUserAuthenticated } from '../../helpers/authUtils'
import Loader from '../../components/Loader'
import TopUp from '../../assets/images/topups.svg'

import RoundUps from './RoundUps'
import RoundUpsTable from './RoundUpsTable'
import TopUpsTable from './TopUpsTable'
import WithdrawalTable from './WithdrawalTable'
// import InvestmentChart from './InvestmentChart'

class Transactions extends Component {
  constructor(props) {
    super(props)

    this.state = {
      roundup: '',
      activeTab: '1'
      // user: getLoggedInUser(),
    }
  }

  updateValue = e => {
    this.setState({
      roundup: e.target.value,
    })
  }

  toggle = tab => {
    console.log(tab)
    console.log(typeof(tab))
    if (tab !== this.state.activeTab) {
      this.setState({
        activeTab: tab
      });
    }
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
    const {roundup, activeTab} = this.state

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
                      <Button color="red" className="mt-1" size="sm">
                        Invest Now
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <RoundUps />

          {/* table */}
          <Row className="mt-4 mb-4">
            <Col md={12}>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '1' })}
                    onClick={() => { this.toggle('1'); }}
                  >
                    ROUND-UPS
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '2' })}
                    onClick={() => { this.toggle('2'); }}
                  >
                    TOP-UPS
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '3' })}
                    onClick={() => { this.toggle('3'); }}
                  >
                    WITHDRAWALS
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <RoundUpsTable />
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <TopUpsTable />
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <WithdrawalTable />
                  </Row>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </div>
      </Fragment>
    )
  }
}

export default Transactions

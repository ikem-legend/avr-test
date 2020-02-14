import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
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
  NavLink,
} from 'reactstrap'
import classnames from 'classnames'

import {isUserAuthenticated} from '../../helpers/authUtils'
// import { getLoggedInUser, isUserAuthenticated } from '../../helpers/authUtils'
import Loader from '../../components/Loader'
import TopUp from '../../assets/images/topups.svg'

import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'
import RoundUps from './RoundUps'
import RoundUpsTable from './RoundUpsTable'
import TopUpsTable from './TopUpsTable'
import WithdrawalTable from './WithdrawalTable'

class Transactions extends Component {
  constructor(props) {
    super(props)

    this.state = {
      roundup: '',
      activeTab: '1',
      // user: getLoggedInUser(),
      multiplier: 1, // id value of multiplier
      invPause: false,
      currDstrbn: [],
    }
  }

  componentDidMount() {
    this.loadUserData()
  }

  loadUserData = () => {
    const {user} = this.props
    callApi('/auth/me', null, 'GET', user.token)
      .then(res => {
        const {
          myMultiplierSetting,
          MyInvestmentPause,
          myCurrencyDistributions,
        } = res.data
        const multiplierList = {1: '1', 2: '2', 3: '5', 4: '10'}
        this.setState({
          multiplier: multiplierList[myMultiplierSetting],
          invPause: MyInvestmentPause,
          user,
          currDstrbn: myCurrencyDistributions,
        })
      })
      .catch(err => {
        console.log(err)
        this.props.showFeedback(err, 'error')
        // this.props.history.push('/account/login')
      })
  }

  updateValue = e => {
    this.setState({
      roundup: e.target.value,
    })
  }

  toggle = tab => {
    if (tab !== this.state.activeTab) {
      this.setState({
        activeTab: tab,
      })
    }
  }

  setTopup = amount => {
    const {currDstrbn} = this.state
    let newCurrDstrbn = currDstrbn.reduce(curr => curr.percentage * amount, {})
    console.log(newCurrDstrbn)
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
    const {user, roundup, activeTab, multiplier, invPause} = this.state

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
                  <Col md={5}>
                    <img src={TopUp} alt="Top-up" className="img-fluid" />
                  </Col>
                  <Col md={3}>
                    <h6 className="top-heading">Top Up</h6>
                    <p>Top-Ups are an easy way to make one-time investments</p>
                  </Col>
                  <Col md={4}>
                    <Form>
                      <FormGroup className="mt-4 mb-1">
                        <Input
                          type="text"
                          name="roundup"
                          className="user-input"
                          placeholder="Enter Amount"
                          value={roundup}
                          onChange={this.updateValue}
                        />
                      </FormGroup>
                      <Button color="red" size="sm" onClick={this.setTopup}>
                        Invest Now
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <RoundUps
            user={user}
            multiplier={multiplier}
            invPause={invPause}
            showFeedback={this.props.showFeedback}
          />

          {/* table */}
          <Row className="mt-4 mb-4">
            <Col md={12}>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({active: activeTab === '1'})}
                    onClick={() => {
                      this.toggle('1')
                    }}
                  >
                    ROUND-UPS
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({active: activeTab === '2'})}
                    onClick={() => {
                      this.toggle('2')
                    }}
                  >
                    TOP-UPS
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({active: activeTab === '3'})}
                    onClick={() => {
                      this.toggle('3')
                    }}
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

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps, {showFeedback})(Transactions)

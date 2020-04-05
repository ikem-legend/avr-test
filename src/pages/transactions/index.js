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
import Loader from '../../assets/images/spin-loader.gif'
import TopUp from '../../assets/images/topups.svg'

import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'
import RoundUps from './RoundUps'
import RoundUpsTable from './RoundUpsTable'
import TopUpsTable from './TopUpsTable'
import WithdrawalTable from './WithdrawalTable'

class Transactions extends Component {
  state = {
    topup: '',
    activeTab: '1',
    multiplier: 1, // id value of multiplier
    invPause: false,
    currDstrbn: [],
    loadingTopup: false,
    txnList: [],
    topupList: [],
    withdrawalList: [],
  }

  componentDidMount() {
    this.loadUserData()
    this.loadRoundups()
    this.loadTopups()
    this.loadWithdrawals()
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
      .catch(() => {
        this.props.showFeedback(
          'Error retrieving user details. Please try again',
          'error',
        )
      })
  }

  loadRoundups = () => {
    const {user} = this.props
    callApi('/user/plaid/bank/get/transactions', null, 'GET', user.token)
      .then(res => {
        this.setState({txnList: res.data})
      })
      .catch(() => {
        this.props.showFeedback(
          'Error retrieving transactions, please try again',
          'error',
        )
      })
  }

  loadTopups = () => {
    const {user} = this.props
    callApi('/user/wallet/fund', null, 'GET', user.token)
      .then(res => {
        this.setState({topupList: res.data})
      })
      .catch(() => {
        this.props.showFeedback(
          'Error retrieving topups, please try again',
          'error',
        )
      })
  }

  loadWithdrawals = () => {
    const {user} = this.props
    callApi('/user/withdraw/fund', null, 'GET', user.token)
      .then(res => {
        this.setState({withdrawalList: res.data})
      })
      .catch(() => {
        this.props.showFeedback(
          'Error retrieving withdrawals, please try again',
          'error',
        )
      })
  }

  updateValue = e => {
    this.setState({
      topup: e.target.value,
    })
  }

  toggle = tab => {
    if (tab !== this.state.activeTab) {
      this.setState({
        activeTab: tab,
      })
    }
  }

  setTopup = () => {
    this.setState({loadingTopup: true})
    const {currDstrbn, topup} = this.state
    const {user} = this.props
    if (topup && parseInt(topup, 10) >= 10) {
      // item + 2 to reflect coin IDs
      const newCurrDstrbn = currDstrbn.map((curr, item) => ({
        currency_id: item + 2,
        amount: (parseInt(curr.percentage, 10) / 100) * parseInt(topup, 10),
      }))
      const fundObj = {
        total: parseInt(topup, 10),
        amount_split: newCurrDstrbn,
      }
      callApi('/user/wallet/fund', fundObj, 'POST', user.token)
        .then(() => {
          this.setState({
            loadingTopup: false,
            topup: 0,
          })
          this.props.showFeedback(
            `$${parseInt(topup, 10)} Top-up made successfully`,
            'success',
          )
        })
        .catch(() => {
          this.setState({loadingTopup: false})
          this.props.showFeedback(
            'Error making top-up, please check the amount and try again',
            'error',
          )
        })
    } else {
      this.setState({loadingTopup: false})
      this.props.showFeedback('Please set minimum topup amount of $10', 'error')
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
    const {
      user,
      topup,
      activeTab,
      multiplier,
      invPause,
      loadingTopup,
      txnList,
      topupList,
      withdrawalList,
    } = this.state

    return (
      <Fragment>
        {this.renderRedirectToRoot()}
        <div className="">
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
                    <p>
                      Top-Ups are an easy way to make one-time minimum
                      investments of $10
                    </p>
                  </Col>
                  <Col md={4}>
                    <Form>
                      <FormGroup className="mt-4 mb-1">
                        <Input
                          type="text"
                          name="topup"
                          className="user-input"
                          placeholder="Enter Amount"
                          value={topup}
                          onChange={this.updateValue}
                        />
                      </FormGroup>
                      {loadingTopup ? (
                        <img
                          src={Loader}
                          alt="loader"
                          style={{height: '40px'}}
                        />
                      ) : (
                        <Button color="red" size="sm" onClick={this.setTopup}>
                          Invest Now
                        </Button>
                      )}
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
            milestone={txnList}
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
                    <RoundUpsTable txnList={txnList} />
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <TopUpsTable topupList={topupList} />
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <WithdrawalTable withdrawalList={withdrawalList} />
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

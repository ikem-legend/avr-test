import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect, Link} from 'react-router-dom'
import {Row, Col, Button, Modal, ModalBody, Form, Input} from 'reactstrap'
import classnames from 'classnames'

import {isUserAuthenticated} from '../../helpers/authUtils'
import {numberWithCommas} from '../../helpers/utils'
import {callApi} from '../../helpers/api'
// import { getLoggedInUser, isUserAuthenticated } from '../../helpers/authUtils'
import Loader from '../../components/Loader'
import {showFeedback} from '../../redux/actions'

import TopUp from '../../assets/images/topups.svg'
import btcImg from '../../assets/images/layouts/btc.svg'
import ethImg from '../../assets/images/layouts/eth.svg'
import WalletStatistics from './WalletStatistics'
import RevenueChart from './RevenueChart'
import InvestmentChart from './InvestmentChart'

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      topupModal: false,
      topup: 0,
      withdrawModal: false,
      withdraw: 0,
      activeCoin: 'btc',
      btcVal: 0,
      ethVal: 0,
      btcRate: 0,
      ethRate: 0,
      walletTotal: 0,
      cryptos: {
        btc: 'Bitcoin',
        eth: 'Etherum',
      },
      exchangeRates: {},
    }
  }

  componentDidMount() {
    this.getExchangeRates()
    this.ratesUpdate = setInterval(() => {
      this.getExchangeRates()
    }, 20000)
  }

  componentWillUnmount() {
    clearInterval(this.ratesUpdate)
  }

  getExchangeRates = () => {
    callApi('https://api.sendwyre.com/v3/rates', null, 'GET', null)
      .then(res => {
        this.setState({
          exchangeRates: res,
        })
      })
      .then(() => {
        const {user} = this.props
        const {
          cryptos: {btc, eth},
          exchangeRates,
        } = this.state
        callApi('/auth/me', null, 'GET', user.token)
          .then(res => {
            const {myWallets} = res.data
            const btcVal =
              myWallets.filter(coin => coin.currency === btc)[0].myBalance *
              exchangeRates.USDBTC
            const ethVal =
              myWallets.filter(coin => coin.currency === eth)[0].myBalance *
              exchangeRates.USDETH
            this.setState({
              btcVal,
              ethVal,
              btcRate: exchangeRates.USDBTC,
              ethRate: exchangeRates.USDETH,
              walletTotal: parseInt(btcVal, 10) + parseInt(ethVal, 10),
            })
          })
          .catch(() => {
            this.props.showFeedback('Error retrieving wallet balance', 'error')
          })
      })
      .catch(() => {
        this.props.showFeedback('Error retrieving exchange rates', 'error')
      })
  }

  toggleTopup = () => {
    const {topupModal} = this.state
    this.setState({
      topupModal: !topupModal,
    })
  }

  toggleWithdraw = () => {
    const {withdrawModal} = this.state
    this.setState({
      withdrawModal: !withdrawModal,
    })
  }

  selectCoin = val => {
    this.setState({
      activeCoin: val,
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
    const {
      topupModal,
      topup,
      withdrawModal,
      withdraw,
      activeCoin,
      btcVal,
      ethVal,
      btcRate,
      ethRate,
      walletTotal,
    } = this.state
    return (
      <Fragment>
        {this.renderRedirectToRoot()}
        <div className="">
          {/* preloader */}
          {this.props.loading && <Loader />}

          <Row className="page-title align-items-center">
            <Col md={2} className="trading-rates">
              <p className="mb-0 mt-0">Real-Time</p>
              <p className="mb-0 mt-0">Cryptocurrency</p>
              <p className="mb-0 mt-0">Trading rates</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="btc">
                <img src={btcImg} alt="Bitcoin" /> Bitcoin{' '}
                <span className="curr-price">
                  ${numberWithCommas(btcRate.toFixed(2))}
                </span>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div className="eth">
                <img src={ethImg} alt="Ethereum" /> Ethereum{' '}
                <span className="curr-price">
                  ${numberWithCommas(ethRate.toFixed(2))}
                </span>
              </div>
            </Col>
          </Row>

          {/* stats */}
          <WalletStatistics
            btcVal={`$${numberWithCommas(parseInt(btcVal, 10).toFixed(2))}`}
            ethVal={`$${numberWithCommas(parseInt(ethVal, 10).toFixed(2))}`}
            walletTotal={`$${numberWithCommas(walletTotal.toFixed(2))}`}
          />

          {/* charts */}
          <Row className="mb-4">
            <Col xl={7}>
              <Row>
                <Col md={4} className="text-center">
                  <Link
                    to="/transactions"
                    className="mr-1 mb-4 btn btn-block btn-inv-blue br-0"
                  >
                    View Rounds-Ups
                  </Link>
                </Col>
                <Col md={4} className="text-center">
                  <Button
                    color="inv-blue"
                    block
                    className="mr-1 mb-4 br-0"
                    onClick={this.toggleTopup}
                  >
                    Quick Wallet Top-Up
                  </Button>
                </Col>
                <Col md={4} className="text-center">
                  <Button
                    color="inv-blue"
                    block
                    className="mr-1 mb-4 br-0"
                    onClick={this.toggleWithdraw}
                  >
                    Withdraw Investment
                  </Button>
                </Col>
              </Row>
              <RevenueChart />
            </Col>
            <Col xl={5}>
              <InvestmentChart />
            </Col>
          </Row>

          {/* Top-up modal */}
          <Modal isOpen={topupModal} toggle={this.toggleTopup} centered>
            <ModalBody>
              <div className="text-center">
                <h4 className="wallet-topup mt-4">Wallet Top Up</h4>
                <p className="mt-4 mb-0">Top-ups are an easy way to</p>
                <p>make one-time investments</p>
                <img src={TopUp} alt="Top Up" className="img-fluid" />
                <h4>$10,273</h4>
                <p>Total Wallet Balance</p>
                <Form row>
                  <Col md={{offset: 2, size: 8}}>
                    <Input
                      name="topup"
                      type="number"
                      placeholder="Enter Amount"
                      value={topup}
                    />
                  </Col>
                  <Col md={{offset: 2, size: 8}}>
                    <Row>
                      <Col md={6}>
                        <Button
                          color="inv-gray"
                          className="mr-2 mt-4 mb-4"
                          block
                          onClick={this.toggleTopup}
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col md={6}>
                        <Button color="inv-blue" className="mt-4 mb-4" block>
                          Fund Wallet
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Form>
              </div>
            </ModalBody>
          </Modal>

          {/* Withdrawal modal */}
          <Modal isOpen={withdrawModal} toggle={this.toggleWithdraw} centered>
            <ModalBody>
              <div className="text-center">
                <h4 className="wallet-topup mt-4 mb-0">Make a withdrawal</h4>
                <p className="mt-0 mb-4">Choose Cryptocurrency</p>
                <Row>
                  <Col md={{offset: 2, size: 4}}>
                    <div
                      className={classnames(
                        {'active-coin': activeCoin === 'btc'},
                        'img-box',
                        'text-center',
                      )}
                      onClick={() => this.selectCoin('btc')}
                      onKeyPress={() => this.selectCoin('btc')}
                    >
                      <img src={btcImg} alt="Bitcoin" className="img-fluid" />
                      <span>Bitcoin</span>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div
                      className={classnames(
                        {'active-coin': activeCoin === 'eth'},
                        'img-box',
                        'text-center',
                      )}
                      onClick={() => this.selectCoin('eth')}
                      onKeyPress={() => this.selectCoin('eth')}
                    >
                      <img src={ethImg} alt="Ethereum" className="img-fluid" />
                      <span>Ethereum</span>
                    </div>
                  </Col>
                </Row>
                <h4 className="mt-4">
                  ${activeCoin === 'btc' ? btcVal : ethVal}
                </h4>
                <Form row>
                  <Col md={{offset: 2, size: 8}}>
                    <Input
                      name="topup"
                      type="number"
                      placeholder="Enter Amount"
                      value={withdraw}
                    />
                  </Col>
                  <Col md={{offset: 2, size: 8}}>
                    <Row>
                      <Col md={6}>
                        <Button
                          color="inv-gray"
                          className="mr-2 mt-4 mb-4"
                          block
                          onClick={this.toggleWithdraw}
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col md={6}>
                        <Button color="inv-blue" className="mt-4 mb-4" block>
                          Withdraw
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Form>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps, {showFeedback})(Dashboard)

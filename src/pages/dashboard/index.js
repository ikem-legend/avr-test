import React, {Component, Fragment} from 'react'
import {Redirect, Link} from 'react-router-dom'
import {Row, Col, Button, Modal, ModalBody, Form, Input} from 'reactstrap'
import classnames from 'classnames'

import {isUserAuthenticated} from '../../helpers/authUtils'
// import { getLoggedInUser, isUserAuthenticated } from '../../helpers/authUtils'
import Loader from '../../components/Loader'

import TopUp from '../../assets/images/topups.svg'
import btc from '../../assets/images/layouts/btc.svg'
import eth from '../../assets/images/layouts/eth.svg'
import WalletStatistics from './WalletStatistics'
import RevenueChart from './RevenueChart'
import InvestmentChart from './InvestmentChart'


class Dashboard extends Component {

	constructor(props) {
		super(props);

		this.state = {
			topupModal: false,
			topup: 0,
			withdrawModal: false,
			withdraw: 0,
			activeCoin: 'btc',
			btcVal: '250.50',
			ethVal: '178.62'
		};
		console.log("seeeeeeeeee")
	}

	toggleTopup = () => {
		const {topupModal} = this.state
		this.setState({
			topupModal: !topupModal
		})
	}

	toggleWithdraw = () => {
		const {withdrawModal} = this.state
		this.setState({
			withdrawModal: !withdrawModal
		})
	}

	selectCoin = val => {
		this.setState({
			activeCoin: val
		});
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
		const {topupModal, topup, withdrawModal, withdraw, activeCoin, btcVal, ethVal} = this.state
  	return (
  		<Fragment>
	  		{this.renderRedirectToRoot()}
	  		<div className="">
			  	{ /* preloader */}
			  	{this.props.loading && <Loader />}

			  	<Row className="page-title align-items-center">
				  	<Col md={2} className="trading-rates">
				  		<p className="mb-0 mt-0">Real-Time</p>
				  		<p className="mb-0 mt-0">Cryptocurrency</p>
				  		<p className="mb-0 mt-0">Trading rates</p>
				  	</Col>
				  	<Col md={3} className="text-center">
				  		<div className="btc">
				  			<img src={btc} alt="Bitcoin"/> Bitcoin <span className="curr-price">$10,473</span><div className="price-change"><i className="uil uil-arrow-up"/>22%</div>
				  		</div>
				  	</Col>
				  	<Col md={3} className="text-center">
				  		<div className="eth">
				  			<img src={eth} alt="Ethereum"/> Ethereum <span className="curr-price">$3,824</span><div className="price-change"><i className="uil uil-arrow-down"/>35%</div>
				  		</div>
				  	</Col>
			  	</Row>

				  {/* stats */}
				  <WalletStatistics />

					{/* charts */}
					<Row className="mb-4">
						<Col xl={7}>
							<Row>
								<Col md={4} className="text-center">
									<Link to="/transactions" className="mr-1 mb-4 btn btn-block btn-inv-blue br-0">View Rounds-Ups</Link>
								</Col>
								<Col md={4} className="text-center">
									<Button color="inv-blue" block className="mr-1 mb-4 br-0" onClick={this.toggleTopup}>Quick Wallet Top-Up</Button>
								</Col>
								<Col md={4} className="text-center">
									<Button color="inv-blue" block className="mr-1 mb-4 br-0" onClick={this.toggleWithdraw}>Withdraw Investment</Button>
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
												<Button color="inv-gray" className="mr-2 mt-4 mb-4" block>Cancel</Button>
											</Col>
											<Col md={6}>
												<Button color="inv-blue" className="mt-4 mb-4" block>Fund Wallet</Button>
											</Col>
										</Row>
									</Col>
								</Form>
							</div>
						</ModalBody>
					</Modal>

					{/* Top-up modal */}
					<Modal isOpen={withdrawModal} toggle={this.toggleWithdraw} centered>
						<ModalBody>
							<div className="text-center">
								<h4 className="wallet-topup mt-4 mb-0">Make a withdrawal</h4>
								<p className="mt-0 mb-4">Choose Cryptocurrency</p>
								<Row>
									<Col md={{offset: 2, size: 4}}>
										<div className={classnames({'active-coin': activeCoin === 'btc'}, 'img-box', 'text-center')} onClick={() => this.selectCoin('btc')}>
											<img src={btc} alt="Bitcoin" className="img-fluid" />
											<span>Bitcoin</span>
										</div>
									</Col>
									<Col md={4}>
										<div className={classnames({'active-coin': activeCoin === 'eth'}, 'img-box', 'text-center')} onClick={() => this.selectCoin('eth')}>
											<img src={eth} alt="Ethereum" className="img-fluid" />
											<span>Ethereum</span>
										</div>
									</Col>
								</Row>
								<h4 className="mt-4">${activeCoin === 'btc' ? btcVal : ethVal}</h4>
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
												<Button color="inv-gray" className="mr-2 mt-4 mb-4" block>Cancel</Button>
											</Col>
											<Col md={6}>
												<Button color="inv-blue" className="mt-4 mb-4" block>Withdraw</Button>
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

export default Dashboard;
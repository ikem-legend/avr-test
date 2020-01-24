import React, { Component, Fragment } from 'react'
import {Redirect, Link} from 'react-router-dom'
import { Row, Col } from 'reactstrap'
// import { Row, Col, Button } from 'reactstrap'

import { isUserAuthenticated } from '../../helpers/authUtils'
// import { getLoggedInUser, isUserAuthenticated } from '../../helpers/authUtils'
import Loader from '../../components/Loader'

import btc from '../../assets/images/layouts/btc.svg'
import eth from '../../assets/images/layouts/eth.svg'
import WalletStatistics from './WalletStatistics'
import RevenueChart from './RevenueChart'
import InvestmentChart from './InvestmentChart'


class Dashboard extends Component {

	constructor(props) {
		super(props);

		this.state = {
			// user: getLoggedInUser(),
		};
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

  	return (
  		<Fragment>
	  		{this.renderRedirectToRoot()}
	  		<div className="">
			  	{ /* preloader */}
			  	{this.props.loading && <Loader />}

			  	{/* <Row className="page-title align-items-center">
				  	<Col sm={4} xl={6}>
				  		<h4 className="mb-1 mt-0">Dashboard</h4>
				  	</Col>
			  	</Row> */}

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
									<Link to="/transactions" className="mr-1 mb-4 btn btn-block btn-inv-blue">View Rounds-Ups</Link>
								</Col>
								<Col md={4} className="text-center">
									{/* Possibly set table value in state and load on mount of transactions page so it loads selected table instead of default*/}
									<Link to="/transactions" className="mr-1 mb-4 btn btn-block btn-inv-blue">Quick Wallet Top-Up</Link>
								</Col>
								<Col md={4} className="text-center">
									<Link to="/transactions" className="mr-1 mb-4 btn btn-block btn-inv-blue">Withdraw Investment</Link>
								</Col>                                    
							</Row>
							<RevenueChart />
						</Col>
						<Col xl={5}>
							<InvestmentChart />
						</Col>
					</Row>
				</div>
			</Fragment>
		)
	}
}

export default Dashboard;
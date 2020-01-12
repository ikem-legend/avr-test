import React, { Component, Fragment } from 'react'
import {Redirect} from 'react-router-dom'
import { Row, Col, Button } from 'reactstrap'

import { getLoggedInUser, isUserAuthenticated } from '../../helpers/authUtils'
import Loader from '../../components/Loader'

import WalletStatistics from './WalletStatistics'
import RevenueChart from './RevenueChart'
import InvestmentChart from './InvestmentChart'


class Dashboard extends Component {

	constructor(props) {
		super(props);

		var oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 15);

		this.state = {
			user: getLoggedInUser(),
			filterDate: [oneWeekAgo, new Date()]
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

			  	<Row className="page-title align-items-center">
				  	<Col sm={4} xl={6}>
				  		<h4 className="mb-1 mt-0">Dashboard</h4>
				  	</Col>
			  	</Row>

				  {/* stats */}
				  <WalletStatistics />

					{/* charts */}
					<Row className="mb-4">
						<Col xl={7}>
							<Row>
								<Col className="text-center">
									<Button color="inv-blue" block className="mr-1 mb-4">View Rounds-Ups</Button>
								</Col>
								<Col className="text-center">
									<Button color="inv-blue" block className="mr-1 mb-4">Quick Wallet Top-Up</Button>
								</Col>
								<Col className="text-center">
									<Button color="inv-blue" block className="mr-1 mb-4">Withdraw Investment</Button>
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
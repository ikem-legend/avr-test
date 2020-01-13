import React, {Component, Fragment} from 'react'
import {Redirect} from 'react-router-dom'
import {Row, Col, Form, Button} from 'reactstrap'

import {isUserAuthenticated} from '../../helpers/authUtils'
// import { getLoggedInUser, isUserAuthenticated } from '../../helpers/authUtils'
import Loader from '../../components/Loader'

import TransactionTables from './TransactionTables'
// import RevenueChart from './RevenueChart'
// import InvestmentChart from './InvestmentChart'


class Transactions extends Component {

	constructor(props) {
		super(props);

		this.state = {
      roundup: ''
			// user: getLoggedInUser(),
		};
	}

  updateValue = e => {
    this.setState({
      roundup: e.target.value
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
    const {roundup} = this.state

  	return (
  		<Fragment>
	  		{this.renderRedirectToRoot()}
	  		<div className="">
			  	{ /* preloader */}
			  	{this.props.loading && <Loader />}

			  	<Row className="page-title align-items-center">
            <Col sm={4}>
              <p className="mb-1 mt-1 text-muted">Avenir rounds up your everyday credit card purchases to the nearest dollar and invests the nearest cents</p>
            </Col>
				  	<Col sm={8}>
				  		<div className="mb-1 mt-1 top-up">
                <Row>
                  <Col>Image</Col>
                  <Col>
                    <h4>Top Up</h4>
                    <p>Top-Ups are an easy way to make one-time investments</p>
                  </Col>
                  <Col>
                    <Form>
                      <input
                        type="text"
                        name="roundup"
                        placeholder="Enter Amount"
                        value={roundup}
                        onChange={this.updateValue}
                      />
                      <Button color="red" className="mt-1" sm>Invest Now</Button>
                    </Form>
                  </Col>
                </Row>
              </div>
				  	</Col>
			  	</Row>

          <Row>
            {/* milestone */}
  				  {/* multipliers */}
          </Row>

					{/* table */}
					<Row className="mb-4">
						<TransactionTables />
					</Row>
				</div>
			</Fragment>
		)
	}
}

export default Transactions;
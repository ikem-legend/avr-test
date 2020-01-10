import React, { Component, Fragment } from 'react'
import {Redirect} from 'react-router-dom'
import { Row, Col } from 'reactstrap'

import { getLoggedInUser, isUserAuthenticated } from '../../helpers/authUtils'
import Loader from '../../components/Loader'

import Statistics from './Statistics'
import RevenueChart from './RevenueChart'
import SalesChart from './SalesChart'


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
                    <Statistics></Statistics>

                    {/* charts */}
                    <Row>
                        <Col xl={6}>
                            <RevenueChart />
                        </Col>
                        <Col xl={6}>
                            <SalesChart />
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }
}


export default Dashboard;
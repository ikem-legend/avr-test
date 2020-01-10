import React, { Component, Fragment } from 'react'
import {Redirect} from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import { Users, Image, ShoppingBag } from 'react-feather'

import { getLoggedInUser, isUserAuthenticated } from '../../helpers/authUtils'
import Loader from '../../components/Loader'
import OverviewWidget from '../../components/OverviewWidget'

import Statistics from './Statistics'
import RevenueChart from './RevenueChart'
import TargetChart from './TargetChart'
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
                        <Col xl={3}>
                            <OverviewWidget items={[
                                { title: '121,000', description: 'Total Visitors', icon: Users },
                                { title: '21,000', description: 'Product Views', icon: Image },
                                { title: '$21.5', description: 'Revenue Per Visitor', icon: ShoppingBag }
                            ]}></OverviewWidget>
                        </Col>

                        <Col xl={6}>
                            <RevenueChart />
                        </Col>
                        <Col xl={3}>
                            <TargetChart />
                        </Col>
                    </Row>

                    {/* charts */}
                    <Row>
                        <Col xl={5}>
                            <SalesChart />
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }
}


export default Dashboard;
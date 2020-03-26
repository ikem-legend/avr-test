// @flow
import React from 'react'
import {Row, Col} from 'reactstrap'

import StatisticsChartWidget from '../../components/StatisticsChartWidget'

const Statistics = ({btcVal, ethVal, walletTotal}) => {
  return (
    <Row>
      <Col md={6} xl={4}>
        <StatisticsChartWidget
          description="Total Wallet Balance"
          title={walletTotal}
          colors={['#43d39e']}
          data={[0]}
          // data={[25, 66, 41, 85, 63, 25, 44, 12, 36, 9, 54]}
          // trend={{
          //   textClass: 'text-success',
          //   icon: 'uil uil-arrow-up',
          //   value: '25.16% (+$3,570)'
          // }}
        />
      </Col>

      <Col md={6} xl={4}>
        <StatisticsChartWidget
          description="Bitcoin Wallet Balance"
          title={btcVal}
          colors={['#43d39e']}
          data={[0]}
          // trend={{
          // 	textClass: 'text-success',
          // 	icon: 'uil uil-arrow-up',
          // 	value: '42.75% (+$2,000)'
          // }}
        />
      </Col>

      <Col md={6} xl={4}>
        <StatisticsChartWidget
          description="Ethereum Wallet Balance"
          title={ethVal}
          colors={['#f77e53']}
          data={[0]}
          // trend={{
          //   textClass: 'text-danger',
          //   icon: 'uil uil-arrow-down',
          //   value: '5.05% (-$522)'
          // }}
        />
      </Col>
    </Row>
  )
}

export default Statistics

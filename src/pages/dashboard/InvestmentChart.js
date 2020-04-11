import React from 'react'
import Chart from 'react-apexcharts'
import {Card, CardBody} from 'reactstrap'

const InvestmentChart = ({myCurrencyDistributions, btcVal, ethVal}) => {
  const btc = myCurrencyDistributions
    ? myCurrencyDistributions.filter(coin => coin.code === 'BTC')[0]
    : null
  const eth = myCurrencyDistributions
    ? myCurrencyDistributions.filter(coin => coin.code === 'ETH')[0]
    : null
  const options = {
    chart: {
      height: 302,
      type: 'donut',
      toolbar: {
        show: false,
      },
      parentHeightOffset: 0,
    },
    colors: ['#00a4ad', '#65dbe1'],
    grid: {
      borderColor: '#f1f3fa',
      padding: {
        left: 0,
        right: 0,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
        },
        expandOnClick: true,
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'left',
      itemMargin: {
        horizontal: 6,
        vertical: 3,
      },
    },
    labels: [
      `Bitcoin ${btcVal ? btcVal : 0.0}, ${btc ? btc.percentage : 0}%`,
      `Ethereum ${ethVal ? ethVal : 0.0}, ${eth ? eth.percentage : 0}%`,
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter: function(value) {
          return `$${value}`
        },
      },
    },
  }

  const data = [btc ? btc.percentage * 10 : 1, eth ? eth.percentage * 10 : 1]

  return (
    <Card>
      <CardBody className="">
        <h6 className="card-title mt-0 mb-4">INVESTMENT DISTRIBUTION</h6>
        <p>
          Manage your investment across various cryptocurrencies. Easily adjust
          the ratio to suit your preference
        </p>
        <Chart
          options={options}
          series={data}
          type="donut"
          className="apex-charts mb-0 mt-4"
          height={302}
        />
      </CardBody>
    </Card>
  )
}

export default InvestmentChart

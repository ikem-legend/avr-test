import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

const SalesChart = () => {
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
        // colors: ['#00a4ad78', '#25c2e3'],
        // colors: ["#5369f8", "#43d39e", "#f77e53", "#ffbe0b"],
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
                expandOnClick: true
            }
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'left',
            itemMargin: {
                horizontal: 6,
                vertical: 3
            }
        },
        labels: ['Bitcoin $2000, 50%', 'Ethereum $1970, 50%'],
        // labels: ['Clothes 44k', 'Smartphons 55k', 'Electronics 41k', 'Other 17k'],
        responsive: [{
            breakpoint: 480,
            options: {
                
                legend: {
                    position: 'bottom'
                }
            }
        }],
        tooltip: {
            y: {
                formatter: function(value) { return `$${value}` }
            },
        }
    };

    const data = [2000, 1970];

    return (
        <Card>
            <CardBody className="">
                <h6 className="card-title mt-0 mb-4">INVESTMENT DISTRIBUTION</h6>
                <p>Manage your investment across various cryptocurrencies. Easily adjust the ratio to suit your preference</p>
                <Chart
                    options={options}
                    series={data}
                    type="donut"
                    className="apex-charts mb-0 mt-4"
                    height={302}
                />
            </CardBody>
        </Card>
    );
};

export default SalesChart;

import React, {Component, Fragment} from 'react'
import {Row, Col, Card, CardBody, Input, Table} from 'reactstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider, {
  Search,
  CSVExport,
} from 'react-bootstrap-table2-toolkit'
import paginationFactory from 'react-bootstrap-table2-paginator'

class RoundUpsTable extends Component {
  constructor() {
    super()
    this.state = {
      roundups: [],
      columns: [
        {
          dataField: 'dateCreated',
          text: 'Date',
          sort: true,
        },
        {
          dataField: 'name',
          text: 'Transaction',
          sort: true,
        },
        {
          dataField: 'amount',
          text: 'Round-Up',
          sort: false,
        },
        {
          dataField: 'status',
          formatter: this.formatStatus,
          text: 'Status',
          sort: true,
        },
        {
          dataField: 'investment_distributions[0].amount',
          formatter: this.balanceDisplay,
          text: 'BTC',
          sort: false,
        },
        {
          dataField: 'investment_distributions[1].amount',
          formatter: this.balanceDisplay,
          text: 'ETH',
          sort: false,
        },
      ],
    }
  }

  formatStatus = status => (
    <span>{`${status[0].toUpperCase()}${status.slice(1)}`}</span>
  )

  balanceDisplay = amount => <span>{parseInt(amount, 10).toFixed(2)}</span>

  componentDidUpdate(prevProps) {
    if (this.props.txnList > prevProps.txnList) {
      this.updateTxnList(this.props.txnList)
    }
  }

  updateTxnList = updatedList => {
    const newList = updatedList.map((item, idx) => ({
      ...item,
      name: 'Roundups',
      key: idx,
    }))
    this.setState({roundups: newList})
  }

  render() {
    const {roundups, columns} = this.state
    // const {txnList} = this.props
    const {SearchBar} = Search
    const {ExportCSVButton} = CSVExport

    const defaultSorted = [
      {
        dataField: 'id',
        order: 'asc',
      },
    ]

    const sizePerPageRenderer = ({
      options,
      currSizePerPage,
      onSizePerPageChange,
    }) => (
      <Fragment>
        <label className="d-inline mr-1" htmlFor="showPageList">
          Show
        </label>
        <Input
          type="select"
          name="select"
          id="no-entries"
          className="custom-select custom-select-sm d-inline col-1"
          defaultValue={currSizePerPage}
          onChange={e => onSizePerPageChange(e.target.value)}
        >
          {options.map((option, idx) => {
            return <option key={idx}>{option.text}</option>
          })}
        </Input>
        <span className="d-inline ml-1">entries</span>
      </Fragment>
    )

    const expandRow = {
      renderer: () => (
        <div>
          {/* <p>expandRow.renderer callback will pass the origin row object to you</p> */}
          <Table striped hover>
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Round-Up</th>
                <th>Multiplier Amount</th>
                <th>Multiplier</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>12-02-2020</td>
                <td>Amazon Store</td>
                <td>$3.19</td>
                <td>$0.81</td>
                <td>$3.24</td>
                <td>4x</td>
              </tr>
              <tr>
                <td></td>
                <td>12-02-2020</td>
                <td>Sephora Store</td>
                <td>$1.45</td>
                <td>$0.55</td>
                <td>$1.10</td>
                <td>2x</td>
              </tr>
              <tr>
                <td></td>
                <td>12-02-2020</td>
                <td>Dunkin Donuts</td>
                <td>$1.45</td>
                <td>$0.55</td>
                <td>$1.10</td>
                <td>2x</td>
              </tr>
              <tr>
                <td></td>
                <td>12-02-2020</td>
                <td>Midas Salon</td>
                <td>$1.45</td>
                <td>$0.55</td>
                <td>$1.10</td>
                <td>2x</td>
              </tr>
            </tbody>
          </Table>
        </div>
      ),
      showExpandColumn: true,
      onlyOneExpanding: true,
      expandHeaderColumnRenderer: ({isAnyExpands}) => {
        return isAnyExpands ? (
          <i className="uil uil-minus" />
        ) : (
          <i className="uil uil-plus" />
        )
      },
      expandColumnRenderer: ({expanded}) => {
        return expanded ? (
          <i className="uil uil-minus" />
        ) : (
          <i className="uil uil-plus" />
        )
      },
    }
    // {roundups[0].map(items => (
    //             <tr>
    //             <td></td>
    //             <td>12-02-2020</td>
    //             <td>Amazon Store</td>
    //             <td>$3.19</td>
    //             <td>$0.81</td>
    //             <td>$3.24</td>
    //             <td>4x</td>
    //           </tr>
    //             )
    //           )}
    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <h4 className="header-title mt-0 mb-1">Roundup details</h4>
            <p className="sub-header">
              Expand row to see additional roundup details
            </p>
            <ToolkitProvider
              bootstrap4
              keyField="id"
              data={roundups}
              columns={columns}
              search
              exportCSV={{onlyExportFiltered: true, exportAll: false}}
            >
              {props => (
                <Fragment>
                  <Row>
                    <Col md={6}>
                      <SearchBar
                        {...props.searchProps}
                        placeholder="Search round-ups, top-ups or withdrawal"
                        style={{
                          width: '500px',
                          border: '1px solid #eaeaea',
                          borderRadius: '0.1rem',
                          color: '#4b4b5a',
                          fontSize: '0.8rem',
                        }}
                      />
                    </Col>
                    <Col className="text-right" md={{offset: 4, size: 2}}>
                      <ExportCSVButton
                        {...props.csvProps}
                        className="btn btn-light-gray"
                      >
                        Export CSV
                      </ExportCSVButton>
                    </Col>
                  </Row>

                  <BootstrapTable
                    {...props.baseProps}
                    bordered={false}
                    defaultSorted={defaultSorted}
                    expandRow={expandRow}
                    pagination={paginationFactory({
                      sizePerPage: 5,
                      sizePerPageRenderer,
                      sizePerPageList: [
                        {text: '5', value: 5},
                        {text: '10', value: 10},
                        {text: '25', value: 25},
                        {text: 'All', value: roundups.length},
                      ],
                    })}
                    wrapperClasses="table-responsive roundups-table text-center"
                  />
                </Fragment>
              )}
            </ToolkitProvider>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

export default RoundUpsTable

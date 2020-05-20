import React, {Component, Fragment} from 'react'
import {Row, Col, Card, CardBody, Input} from 'reactstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider, {
  Search,
  CSVExport,
} from 'react-bootstrap-table2-toolkit'
import paginationFactory from 'react-bootstrap-table2-paginator'

class WithdrawalTable extends Component {
  constructor() {
    super()
    this.state = {
      withdrawals: [],
      columns: [
        {
          dataField: 'dateCreated',
          text: 'Date',
          sort: true,
        },
        {
          dataField: 'account',
          text: 'Bank Account',
          sort: false,
        },
        {
          dataField: 'amount',
          formatter: this.formatCurr,
          text: 'Amount',
          sort: false,
        },
        {
          dataField: 'status',
          formatter: this.formatStatus,
          text: 'Status',
          sort: true,
        },
        {
          dataField: 'source',
          text: 'Funding Source',
          sort: false,
        },
      ],
    }
  }

  /**
   * Format status text
   * @param {string} status Status
   * @returns {string} Formatted text
   */
  formatStatus = status => (
    <span>{`${status[0].toUpperCase()}${status.slice(1)}`}</span>
  )

  /**
   * Format amount text
   * @param {string} amount Amount
   * @returns {string} Formatted text
   */
  formatCurr = amount => <span>${amount}</span>

  render() {
    const {withdrawals, columns} = this.state
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
        <label htmlFor="pageSize" className="d-inline mr-1">
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

    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <ToolkitProvider
              bootstrap4
              keyField="id"
              data={withdrawals}
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
                        style={{width: '300px'}}
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
                    pagination={paginationFactory({
                      sizePerPage: 5,
                      sizePerPageRenderer,
                      sizePerPageList: [
                        {text: '5', value: 5},
                        {text: '10', value: 10},
                        {text: '25', value: 25},
                        {text: 'All', value: withdrawals.length},
                      ],
                    })}
                    wrapperClasses="table-responsive withdrawal-table text-center"
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

export default WithdrawalTable

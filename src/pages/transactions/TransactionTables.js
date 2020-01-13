import React, {Component} from 'react'
import {Row, Col, Button} from 'reactstrap'

class TransactionTables extends Component {
  render() {
    return (
      <Col sm={12}>
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
      </Col>
    )
  }
}

export default TransactionTables
import React, {Component} from 'react'
import {Row, Col, Button} from 'reactstrap'
import classnames from 'classnames'

/**
 * Renders the UserFundingSource
 */
class UserFundingSource extends Component {
  constructor(props) {
    super()
    this.state = {
      source: props.fs.accountFundingSource,
      sourceText: props.fs.accountFundingSource ? 'Funding Source' : 'Regular Account',
    }
  }

  render() {
    const {source, sourceText} = this.state
    const {fs} = this.props
    return (
      <Row className="funding-source p-2 m-0">
        <Col md={6} key={`${fs.id}`} className="font-weight-bold acct-name my-auto">
          {fs.accountName}
        </Col>
        <Col md={3} className="my-auto">
          ****{fs.accountMask}
        </Col>
        <Col md={3}>
          <Button block color="transparent" className={classnames({'linked': source === true, 'unlinked': source === false}, 'float-right')}>{sourceText}</Button>
        </Col>
      </Row>
    )
  }
}

export default UserFundingSource

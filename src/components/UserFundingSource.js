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
      <Row key={`${fs.id}`} className="mb-2">
        <Col md={6} className="font-weight-bold acct-name">
          {fs.accountName}
        </Col>
        <Col md={3}>
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

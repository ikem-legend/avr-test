import React, {Component} from 'react'
import {Row, Col, Button} from 'reactstrap'
import classnames from 'classnames'

/**
 * Renders the FundingSourceList
 */
class FundingSourceList extends Component {
  constructor(props) {
    super()
    this.state = {
      linked: props.acctDetail.accountLink,
      linkText: props.acctDetail.accountLink ? 'Link' : 'Unlink',
      source: props.acctDetail.fundingSource,
      sourceText: props.acctDetail.fundingSource ? 'Funding Source' : 'Regular Account',
    }
  }

  modify = () => {
    const {linked, linkText} = this.state
    const {acctDetail, accountsLinked} = this.props
    // const {details, accountsLinked, acctDetail} = this.props
    accountsLinked(acctDetail.id, !linked)
    this.setState({
      linked: !linked,
      linkText: linkText === 'Unlink' ? 'Link' : 'Unlink',
    });
  }

  updateFundingSource = () => {
    const {source, sourceText} = this.state
    const {acctDetail, fundingSource} = this.props
    fundingSource(acctDetail.id, !source)
    this.setState({
      source: !source,
      sourceText: sourceText === 'Regular Account' ? 'Funding Source' : 'Regular Account',
    });
  }

  render() {
    const {linked, linkText, source, sourceText} = this.state
    const {acct, acctDetail} = this.props
    return (
      <Row key={`${acct.institutionId}-${acctDetail.id}`} className="mb-2">
        <Col md={3} className="font-weight-bold acct-name">
          {acctDetail.accountName}
        </Col>
        <Col md={3}>****{acctDetail.accountMask}</Col>
        <Col md={3}>
          <Button
            block
            color="transparent"
            className={classnames(
              {linked: linked === true, unlinked: linked === false},
              'float-right',
            )}
            onClick={this.modify}
          >
            {linkText}
          </Button>
        </Col>
        <Col md={3}>
          <Button block color="transparent" className={classnames({'linked': source === true, 'unlinked': source === false}, 'float-right')} onClick={this.updateFundingSource}>{sourceText}</Button>
        </Col>
      </Row>
    )
  }
}

export default FundingSourceList

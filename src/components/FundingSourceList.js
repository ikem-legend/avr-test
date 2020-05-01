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
    }
  }

  modify = () => {
    const {linked, linkText} = this.state
    const {acctDetail, accountsLinked} = this.props
    accountsLinked(acctDetail.id, !linked)
    this.setState({
      linked: !linked,
      linkText: linkText === 'Unlink' ? 'Link' : 'Unlink',
    });
  }

  updateFundingSource = () => {
    const {source} = this.state
    const {acctDetail, fundingSource} = this.props
    fundingSource(acctDetail.id, !source)
    this.setState({
      source: !source,
    });
  }

  render() {
    const {linked, linkText, source} = this.state
    const {acct, acctDetail} = this.props
    return (
      <Row key={`${acct.institutionId}-${acctDetail.id}`} className="mb-2 p-2 funding-source">
        <Col md={3} className="font-weight-bold acct-name my-auto px-1">
          {acctDetail.accountName}
        </Col>
        <Col md={3} className="my-auto">
          ****{acctDetail.accountMask}
        </Col>
        <Col md={3}>
          <Button block color="transparent" className={classnames({'linked': linked === true, 'unlinked': linked === false}, 'float-right')} onClick={this.modify}>{linkText}</Button>
        </Col>
        <Col md={3} className="mb-3 my-auto text-center">
          {/*<CustomInput
            id={acctDetail.id}
            type="checkbox"
            className="funding"
            defaultChecked={source}
            onChange={this.updateFundingSource}
          />*/}
          <Button color="transparent" className={classnames({'linked': source === true, 'unlinked': source === false}, 'funding-btn', 'text-center')} onClick={this.updateFundingSource} />
        </Col>
      </Row>
    )
  }
}

export default FundingSourceList

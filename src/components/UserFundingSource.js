import React, {Component} from 'react'
import {Row, Col, Button} from 'reactstrap'
import classnames from 'classnames'

/**
 * Renders the UserFundingSource
 */
class UserFundingSource extends Component {
  constructor(props) {
    console.log(props)
    super()
    this.state = {
      source: props.fs.accountFundingSource,
      sourceText: props.fs.accountFundingSource ? 'Funding Source' : 'Regular Account',
    }
  }

  // modify = () => {
  //   const {linked, linkText} = this.state
  //   const {acctDetail, accountsLinked} = this.props
  //   // const {details, accountsLinked, acctDetail} = this.props
  //   accountsLinked(acctDetail.id, !linked)
  //   this.setState({
  //     linked: !linked,
  //     linkText: linkText === 'Unlink' ? 'Link' : 'Unlink',
  //   });
  // }

  // updateFundingSource = () => {
  //   const {source, sourceText} = this.state
  //   const {acctDetail, fundingSource} = this.props
  //   fundingSource(acctDetail.id, !source)
  //   this.setState({
  //     source: !source,
  //     sourceText: sourceText === 'Regular Account' ? 'Funding Source' : 'Regular Account',
  //   });
  // }

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

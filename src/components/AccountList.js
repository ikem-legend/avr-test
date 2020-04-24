import React, {Component} from 'react'
import {Row, Col, Card, CardBody, Button, CustomInput} from 'reactstrap'
import classnames from 'classnames'

/**
 * Renders the AccountList
 */
class AccountList extends Component {
  constructor(props) {
    super()
    this.state = {
      linked: props.details.accountLink,
      linkText: props.details.accountLink ? 'Link' : 'Unlink',
      source: props.details.fundingSource,
    }
  }

  modify = () => {
    const {linked, linkText} = this.state
    const {details, accountsLinked} = this.props
    accountsLinked(details.id, !linked)
    this.setState({
      linked: !linked,
      linkText: linkText === 'Unlinked' ? 'Linked' : 'Unlinked',
    })
  }

  updateFundingSource = () => {
    const {source} = this.state
    const {details, fundingSource} = this.props
    fundingSource(details.id, !source)
    this.setState({
      source: !source,
    })
  }

  render() {
    const {linked, linkText, source} = this.state
    const {details} = this.props
    return (
      <Card>
        <CardBody className="account-list">
          <Row>
            <Col md={6} className="account-details">
              <h5>
                {details.accountName} - {details.accountMask}
              </h5>
            </Col>
            <Col md={3} className="text-center">
              <Button
                block
                color="transparent"
                className={classnames({linked, unlinked: !linked})}
                onClick={this.modify}
              >
                {linkText}
              </Button>
            </Col>
            <Col md={3} className="my-auto">
              <CustomInput
                id={details.id}
                type="checkbox"
                className="funding"
                checked={source}
                // defaultChecked={source}
                onClick={this.updateFundingSource}
                // onChange={this.updateFundingSource}
              />
              {/*<Button
                block
                color="transparent"
                className={classnames(
                  {linked: source === true, unlinked: source === false},
                  'float-right',
                )}
                onClick={this.updateFundingSource}
              >
                {sourceText}
              </Button>*/}
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }
}

export default AccountList

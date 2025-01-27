import React, {Component} from 'react'
import {Row, Col, Card, CardBody, Button} from 'reactstrap'
import classnames from 'classnames'

/**
 * Renders the AccountList
 */
class CardList extends Component {
  constructor() {
    super()
    this.state = {
      linked: true,
      linkText: 'Linked'
    }
  }

  modify = () => {
    const {linked, linkText} = this.state
    const {details, cardsLinked} = this.props
    cardsLinked(details.id, !linked)
    this.setState({
      linked: !linked,
      linkText: linkText === 'Unlinked' ? 'Linked' : 'Unlinked'
    });
  }

  render() {
    const {linked, linkText} = this.state
    const {details} = this.props
    return (
      <Card>
        <CardBody className="account-list">
          <Row>
            <Col md={9} className="account-details">
              <h5>{details.accountName} - {details.accountMask}</h5>
            </Col>
            <Col md={3} className="text-center">
              <Button block color="transparent" className={classnames({ linked, 'unlinked': !linked})} onClick={this.modify}>{linkText}</Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }
}

export default CardList

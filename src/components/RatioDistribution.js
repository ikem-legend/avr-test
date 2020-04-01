import React, {Component} from 'react'
import {Row, Col, Input, InputGroup, InputGroupText, InputGroupAddon, Button} from 'reactstrap'
import btcImg from '../assets/images/layouts/btc.svg'
import ethImg from '../assets/images/layouts/eth.svg'
import Loader from '../assets/images/spin-loader.gif'

/**
 * Renders the RatioDistribution
 */
class RatioDistribution extends Component {

  render() {
    const {btc, eth, loadingDstrbn, updateRatio, saveRatio} = this.props
    return (
      <Row form>
        <Col md={12}>
          <span className="edit-ratio">Edit crypto investment ratio below</span>
          <Row>
            <Col md={6}>
              <InputGroup size="lg">
                <InputGroupAddon addonType="prepend" className="font-weight-bold text-center"> 
                  <InputGroupText><img src={btcImg} alt="Bitcoin" className="invCoin mr-1" /> Bitcoin</InputGroupText>
                </InputGroupAddon>
                <Input type="number" name="btc" value={btc} onChange={updateRatio} min="0" max="100" />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup size="lg">
                <InputGroupAddon addonType="prepend" className="font-weight-bold text-center"> 
                  <InputGroupText><img src={ethImg} alt="Ethereum" className="invCoin mr-1" /> Ethereum</InputGroupText>
                </InputGroupAddon>
                <Input type="number" name="eth" value={eth} onChange={updateRatio} min="0" max="100" />
              </InputGroup>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={{size:2, offset: 10}}>
              {loadingDstrbn ? (
                <img
                  src={Loader}
                  alt="loader"
                  style={{height: '40px'}}
                />
              ): (
                <Button color="red" block onClick={saveRatio}>Save</Button>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default RatioDistribution
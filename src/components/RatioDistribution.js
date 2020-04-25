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
          <div className="text-center mb-5">
            <h4 className="edit-ratio">Investment Distribution</h4>
            <p className="mb-0">Manage your investment across various cryptocurrencies</p>
            <p>Easily adjust ratio to suit your preference</p>
          </div>
          <Row>
            <Col md={6}>
              <InputGroup size="lg">
                <InputGroupAddon addonType="prepend" className="font-weight-bold text-center"> 
                  <InputGroupText><img src={btcImg} alt="Bitcoin" className="invCoin mr-1" /> <span className="font-weight-bold">Bitcoin</span></InputGroupText>
                </InputGroupAddon>
                <Input type="number" name="btc" value={btc} onChange={updateRatio} min="0" max="100" />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup size="lg">
                <InputGroupAddon addonType="prepend" className="font-weight-bold text-center"> 
                  <InputGroupText><img src={ethImg} alt="Ethereum" className="invCoin mr-1" /> <span className="font-weight-bold">Ethereum</span></InputGroupText>
                </InputGroupAddon>
                <Input type="number" name="eth" value={eth} onChange={updateRatio} min="0" max="100" />
              </InputGroup>
            </Col>
          </Row>
          <Row className="mt-2 text-center">
            <Col md={{size: 4, offset: 8}}>
              {loadingDstrbn ? (
                <img
                  src={Loader}
                  alt="loader"
                  style={{height: '40px'}}
                />
              ): (
                <Button color="blue" className="mt-2" block onClick={saveRatio}>Continue Account Setup</Button>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default RatioDistribution
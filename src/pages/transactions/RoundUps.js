import React, {Component, Fragment} from 'react'
import {
  Row,
  Col,
  Form,
  FormGroup,
  CustomInput,
  Button,
  Progress,
} from 'reactstrap'

import Loader from '../../components/Loader'

class RoundUps extends Component {

  render() {
    return (
      <Fragment>
        {/* preloader */}
        {this.props.loading && <Loader />}

        <Row>
          {/* milestone */}
          <Col md={8}>
            <Row>
              <Col md={8}>
                <h4>Round-Up Milestone</h4>
              </Col>
              <Col md={4} className="roundup-milestone">
                <Form>
                  <FormGroup row>
                    <span>PAUSE </span><span> </span>
                    <CustomInput
                      type="switch"
                      id="roundupsSwitch"
                      name="roundupsSwitch"
                      label="RESUME"
                    />
                  </FormGroup>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <Progress value="52" color="blue" className="roundup-bar">
                  $2.60 Roundup (52%)
                </Progress>
              </Col>
            </Row>
          </Col>
          {/* multipliers */}
          <Col md={4}>
            <p>
              Multiply your roundup amount to accelerate your investments. Eg:
              $0.10 in round-ups will be $0.20 in 2x
            </p>
            <Row>
              <Col md={2}>
                <Button color="light-blue">1x</Button>
              </Col>
              <Col md={2}>
                <Button color="deep-blue">2x</Button>
              </Col>
              <Col md={2}>
                <Button color="light-blue">5x</Button>
              </Col>
              <Col md={2}>
                <Button color="light-blue">10x</Button>
              </Col>
              <Col md={4}>
                <Button color="light-blue block">SAVE</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

export default RoundUps

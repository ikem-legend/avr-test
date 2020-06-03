import React, {Component, Fragment, createRef} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {
  Row,
  Col,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from 'reactstrap'
import {Link} from 'react-feather'
import {showFeedback} from '../../redux/actions'
import {callApi} from '../../helpers/api'
import {isUserAuthenticated} from '../../helpers/authUtils'
import Loader from '../../components/Loader'

class Referral extends Component {
  constructor(props) {
    super(props)

    this.state = {
      referralCode: '',
      referralUrl: '',
      // copySuccess: '',
    }
    this.refUrlInput = createRef()
  }

  componentDidMount() {
    this.loadRefData()
  }

  loadRefData = () => {
    const {user} = this.props
    callApi('/auth/me', null, 'GET', user.token)
      .then(res => {
        const {myIdentifier} = res.data
        this.setState({
          referralCode: myIdentifier,
          referralUrl: `https://my.avenir-app.com/r/${myIdentifier}`,
        })
      })
      .catch(() => {
        this.props.showFeedback('Error displaying user data', 'error')
      })
  }

  /**
   * Copy referral code
   */
  copyRefCode = () => {
    // console.log(this.refUrlInput)
    // console.log(this.refUrlInput.select())
    document.execCommand('copy')
    // this.setState({copySuccess: 'Copied!'})
  }

  /**
   * Redirect to root
   * @returns {object} Redirect component
   */
  renderRedirectToRoot = () => {
    const isAuthTokenValid = isUserAuthenticated()
    if (!isAuthTokenValid) {
      return <Redirect to="/account/login" />
    }
  }

  render() {
    const {referralCode, referralUrl} = this.state
    return (
      <Fragment>
        {this.renderRedirectToRoot()}
        <div className="">
          {/* preloader */}
          {this.props.loading && <Loader />}

          <Row className="page-title align-items-center">
            <Col md={4} className="trading-rates">
              <p className="mb-0 mt-0 referral-head font-weight-bold">
                Help your friends get into crypto
              </p>
              <p className="mb-0 mt-0">
                Invite your friends and make $10 for you
              </p>
              <p className="mb-0 mt-0">and your friend each if they sign up</p>
              <p className="mb-0 mt-0">
                Set your referral URL <span className="referral-url">here</span>
              </p>
            </Col>
            <Col md={3} className="text-center">
              <h4>Rewards earned</h4>
              <p className="referral-amount">$0.00</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="">
                <Button block className="btn-red" size="lg">
                  Share Referral Link
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <div className="referral-block p-4 h-100">
                <h4>Referral Code</h4>
                <hr />
                <p className="referral-code">{referralCode}</p>
                <InputGroup>
                  {/* <Input type="text" value={referralUrl} readOnly className="referral-url" ref={this.textInput} /> Style input field as text area -> resize: none; height: calc(1.5em + 1rem + 2px); */}
                  <Input
                    type="textarea"
                    ref={this.refUrlInput}
                    value={referralUrl}
                    readOnly
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <Link onClick={this.copyRefCode} />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </Col>
            <Col md={7}>
              <div className="referral-perf-block p-4 h-100">
                <h4>Performance</h4>
                <hr />
                <Row>
                  <Col xs={4}>
                    <p className="mt-4">Amount per Referral</p>
                    <h4>$0</h4>
                  </Col>
                  <Col xs={4}>
                    <p className="mt-4">Referral count</p>
                    <h4>0</h4>
                  </Col>
                  <Col xs={4}>
                    <p className="mt-4">Current signups</p>
                    <h4>0</h4>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps, {showFeedback})(Referral)

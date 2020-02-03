import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
// import {Redirect} from 'react-router-dom'
import {
  Row,
  Col,
  CustomInput,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button
} from 'reactstrap'
import classnames from 'classnames'
import Loader from '../../components/Loader'
import {callApi} from '../../helpers/api'
import {showFeedback} from '../../redux/actions'
import btcImg from '../../assets/images/layouts/btc.svg'
import ethImg from '../../assets/images/layouts/eth.svg'

class BanksCards extends Component {
	constructor() {
		super()
		this.state = {
			linkedCards: [],
			// btc: 50,
			// eth: 50,
		}
	}

  componentDidMount() {
    this.loadUserData()
  }

  
  loadUserData = () => {
    const {user} = this.props
    callApi('/auth/me', null, 'GET', user.token)
      .then(res => {
        // console.log(res)
        const {MyInvestmentPause, myMultiplierSetting, myCurrencyDistributions} = res.data
        const multiplierList = {1: '1', 2: '2', 3: '5', 4: '10'}
        const btcVal = myCurrencyDistributions[0].percentage
        const ethVal = myCurrencyDistributions[1].percentage
        this.setState({
          btc: btcVal,
          eth: ethVal,
        });
      })
      .catch(err => {
        // this.props.showFeedback('Error retrieving user details. Please try again', 'error')
        this.props.showFeedback(err, 'error')
      })
  }

	render() {
    const {btc, eth} = this.state
		return (
      <Fragment>
  			<Row>
  				<Col md={12}>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="mb-2">
            <p>Connect your Bank Account. We will use this bank account for your weekly round-ups deposits, one-time investments and the destination for your withdrawals. Please acknowledge the Avenir debit authorization and a $5 processing fee</p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
          </Col>
        </Row>
        <Row form>
          <Col md={12}>
          </Col>
        </Row>
      </Fragment>
		)
	}
}

const mapStateToProps = state => ({
	user: state.Auth.user
})

export default connect(mapStateToProps, {showFeedback})(BanksCards)
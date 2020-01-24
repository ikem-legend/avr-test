import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  Progress,
  CustomInput,
  //  Nav,
  //  NavItem,
  //  NavLink
} from 'reactstrap'
// import classnames from 'classnames'

import {isUserAuthenticated} from '../../helpers/authUtils'
// import { getLoggedInUser, isUserAuthenticated } from '../../helpers/authUtils'
import Loader from '../../components/Loader'
import TopUp from '../../assets/images/topups.svg'
import profilePic from '../../assets/images/users/user-profile@2x.png'

// import RoundUps from './RoundUps'
// import RoundUpsTable from './RoundUpsTable'
// import TopUpsTable from './TopUpsTable'
// import WithdrawalTable from './WithdrawalTable'
// import InvestmentChart from './InvestmentChart'

class Account extends Component {
  constructor(props) {
    super(props)

    this.state = {
      roundup: '',
      activeTab: '1',
      // user: getLoggedInUser(),
    }
  }

  updateValue = e => {
    this.setState({
      roundup: e.target.value,
    })
  }

  toggle = tab => {
    console.log(tab)
    console.log(typeof tab)
    if (tab !== this.state.activeTab) {
      this.setState({
        activeTab: tab,
      })
    }
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
    const {roundup} = this.state
    const {user} = this.props

    return (
      <Fragment>
        {this.renderRedirectToRoot()}
        <div className="">
          {/* preloader */}
          {this.props.loading && <Loader />}

          <Row className="page-title align-items-center">
            <Col md={4}>
              <div className="account-profile">
                <h6>My Account</h6>
                <div className="media user-profile user-avatar mt-2">
                  <img
                    src={profilePic}
                    className="avatar-lg rounded-circle mr-2"
                    alt="Avenir"
                  />
                  <img
                    src={profilePic}
                    className="avatar-xs rounded-circle mr-2"
                    alt="Avenir"
                  />
                </div>
                <h4 className="mb-4">
                  {user.myFirstName} {user.myLastName}
                </h4>
                <hr />
                <span>{user.myEmailAddress}</span>
                <p className="mt-1 mb-3">
                  <span>{user.myPhoneNumber}</span>
                </p>
                <div className="mt-3">
                  Account Setup - <span className="setup">75%</span>
                </div>
                <Progress value="75" className="setup-level" />
                <hr />
                <CustomInput
                  type="checkbox"
                  id="exampleCustomCheckbox"
                  label="Link my credit card(s)"
                />
              </div>
            </Col>
            <Col md={8}>
            </Col>
          </Row>

          {/* table */}
          <Row className="mt-4 mb-4">
            <Col md={12}></Col>
          </Row>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps)(Account)

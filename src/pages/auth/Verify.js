import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {Container, Row, Col, Alert} from 'reactstrap'

import {callApi} from '../../helpers/api'
import {registerUser} from '../../redux/actions'
import {isUserAuthenticated} from '../../helpers/authUtils'
import Loader from '../../components/Loader'
// import logo from '../../assets/images/logo.png';

class Verify extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      name: '',
    }
  }

  async componentDidMount() {
    this._isMounted = true
    document.body.classList.add('authentication-bg')
    const {firstname, lastname} = this.state
    // Another possible solution is to use an array to loop through the state then update field styling
    if (firstname && lastname) {
      document.querySelectorAll('.float-container').classList.add('active')
    }
    await callApi('/data/countries', null, 'GET')
      .then(response => {
        // console.log(response)
        const countryList = response.data.map(coun => ({
          value: coun.id,
          label: coun.name,
        }))
        this.setState({
          countries: countryList,
        })
      })
      .catch(err => console.log(err))
    const user = JSON.parse(localStorage.getItem('avenir'))
    // console.log(user.myFirstName)
    this.setState({
      name: user.myFirstName,
    })
  }

  componentWillUnmount() {
    this._isMounted = false
    document.body.classList.remove('authentication-bg')
  }

  updateTerms = e => {
    const {value} = e.target
    console.log(value)
    this.setState({
      terms: value,
    })
  }

  /**
   * Redirect to root
   */
  renderRedirectToRoot = () => {
    const isAuthTokenValid = isUserAuthenticated()
    // Since user is signed in at the point when this page is accessed, then reverse logic is applied
    // Means user is redirected if not logged in
    if (isAuthTokenValid) {
      // console.log("aha")
      return <Redirect to="/" />
    }
  }

  /**
   * Redirect to confirm
   */
  renderRedirectToConfirm = () => {
    return <Redirect to="/account/confirm" />
  }

  render() {
    const isAuthTokenValid = isUserAuthenticated()
    const {name} = this.state
    console.log(name)
    return (
      <Fragment>
        {this.renderRedirectToRoot()}

        {Object.keys(this.props.user || {}).length > 0 &&
          this.renderRedirectToConfirm()}

        {(this._isMounted || !isAuthTokenValid) && (
          <div className="account-pages mt-5 mb-5">
            <Container>
              <Row className="justify-content-center">
                <Col xl={12}>
                  <Row>
                    <Col md={6} className="d-none d-md-inline-block">
                      <div className="auth-page-sidebar">
                        <div className="auth-user-testimonial"></div>
                      </div>
                      <div className="overlay signup-bg"></div>
                    </Col>
                    <Col md={6} className="position-relative d-flex h-100">
                      {/* preloader */}
                      {this.props.loading && <Loader />}

                      <div className="auth-page-sidebar mt-5 h-100 m-xy-auto">
                        <div className="overlay mt-5 mb-5"></div>
                        <div className="auth-user-testimonial mt-5">
                          <p className="lead font-weight-bold mt-5 pl-3">
                            Create an Account
                          </p>
                          <p className="font-size-24 font-weight-bold mb-1 pl-3">
                            Verifying your Identity...
                          </p>
                          <div className="bank-verify-info text-center p-3">
                            <p className="font-weight-bold text-muted mb-0">
                              Hey {name ? name : ''}, We’re talking to our
                              banking partner to
                            </p>
                            <p className="font-weight-bold text-muted mb-0">
                              verify your information. This should just take
                              seconds
                            </p>
                          </div>
                        </div>
                      </div>
                      <h6 className="h5 mb-0 mt-4"></h6>

                      {this.props.error && (
                        <Alert color="danger" isOpen={this.props.error}>
                          <div>{this.props.error}</div>
                        </Alert>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </Fragment>
    )
  }
}

// const mapStateToProps = (state) => {
// const { user, loading, error } = state.Auth;
// return { user, loading, error };
// };

export default connect(null, {registerUser})(Verify)
// export default connect(mapStateToProps, { registerUser })(Verify);

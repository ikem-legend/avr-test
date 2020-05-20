import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect, Link} from 'react-router-dom'
import {Row, Col, Button, Modal, ModalBody, Form, Input} from 'reactstrap'
import classnames from 'classnames'
import {toast} from 'react-toastify'

import {isUserAuthenticated} from '../../helpers/authUtils'
import {numberWithCommas, resizeImage, toFormData} from '../../helpers/utils'
import {callApi} from '../../helpers/api'
import Loader from '../../components/Loader'
import DocumentUpload from '../../components/DocumentUpload'
import {showFeedback, updateUserData} from '../../redux/actions'

import TopUp from '../../assets/images/topups.svg'
import TopUpLoader from '../../assets/images/spin-loader.gif'
import btcImg from '../../assets/images/layouts/btc.svg'
import ethImg from '../../assets/images/layouts/eth.svg'
import WalletStatistics from './WalletStatistics'
import RevenueChart from './RevenueChart'
import InvestmentChart from './InvestmentChart'

class Dashboard extends Component {
  constructor() {
    super()

    this.state = {
      userDocument: ['', ''],
      idType: 'individualProofOfAddress',
      userDocumentModal: true,
      loadingUpload: false,
      uploadStatus: 'pending',
      topupModal: false,
      topup: 10,
      withdrawModal: false,
      withdraw: 0,
      activeCoin: 'btc',
      btcVal: 0,
      ethVal: 0,
      btcRate: 0,
      ethRate: 0,
      walletTotal: 0,
      cryptos: {
        btc: 'Bitcoin',
        eth: 'Ethereum',
      },
      myCurrencyDistributions: [],
      exchangeRates: {},
      loadingTopup: false,
      loadingWithdraw: false,
    }
  }

  componentDidMount() {
    this.getExchangeRates()
    this.ratesUpdate = setInterval(() => {
      this.getExchangeRates()
    }, 20000)
  }

  componentWillUnmount() {
    clearInterval(this.ratesUpdate)
  }

  /**
   * Get exchange rates from SendWyre
   */
  getExchangeRates = () => {
    callApi('https://api.sendwyre.com/v3/rates', null, 'GET', null)
      .then(res => {
        this.setState({
          exchangeRates: res,
        })
      })
      .then(() => {
        const {user} = this.props
        const {
          cryptos: {btc, eth},
          exchangeRates,
        } = this.state
        callApi('/auth/me', null, 'GET', user.token)
          .then(res => {
            const {
              myWallets,
              myCurrencyDistributions,
              setup: {
                documentUpload: {done, status},
              },
            } = res.data
            const btcVal =
              myWallets.filter(coin => coin.currency === btc)[0].myBalance *
              exchangeRates.USDBTC
            const ethVal =
              myWallets.filter(coin => coin.currency === eth)[0].myBalance *
              exchangeRates.USDETH
            const userObj = {}
            // Ensure that docUploadState is updated. This helps ensure that once the user cancels the document upload, it does not show up until their next login
            const docUploadStateData = JSON.parse(
              localStorage.getItem('avenirApp'),
            ).docUploadState
              ? JSON.parse(localStorage.getItem('avenirApp')).docUploadState
              : false
            Object.assign(
              userObj,
              {...res.data},
              {token: user.token},
              {docUploadState: docUploadStateData},
            )
            // Replicate similar logic here to ensure this fires just once
            if (user.setup.documentUpload.done === false && done === true) {
              this.props.updateUserData(userObj)
            }
            if (docUploadStateData === true) {
              this.props.updateUserData(userObj)
            }
            this.setState(
              {
                btcVal,
                ethVal,
                btcRate: exchangeRates.USDBTC,
                ethRate: exchangeRates.USDETH,
                myCurrencyDistributions,
                walletTotal: parseInt(btcVal, 10) + parseInt(ethVal, 10),
                uploadStatus: status,
              },
              () => {
                const {userDocumentModal, uploadStatus} = this.state
                if (uploadStatus === 'pending' && userDocumentModal === false) {
                  this.toggleImgUpload()
                }
              },
            )
          })
          .catch(() => {
            this.props.showFeedback('Error retrieving wallet balance', 'error')
          })
      })
      .catch(() => {
        this.props.showFeedback('Error retrieving exchange rates', 'error')
      })
  }

  /**
   * Toggle topup modal
   */
  toggleTopup = () => {
    const {topupModal} = this.state
    this.setState({
      topupModal: !topupModal,
    })
  }

  /**
   * Update topup in state
   * @param {object} e Global event object
   */
  updateTopup = e => {
    const {value} = e.target
    this.setState({topup: value})
  }

  /**
   * Set topup setting via API
   */
  setTopup = () => {
    this.setState({loadingTopup: true})
    const {myCurrencyDistributions, topup} = this.state
    const {user} = this.props
    if (topup && parseInt(topup, 10) >= 10) {
      // item + 2 to reflect coin IDs
      const newCurrDstrbn = myCurrencyDistributions.map((curr, item) => ({
        currency_id: item + 2,
        amount: (parseInt(curr.percentage, 10) / 100) * parseInt(topup, 10),
      }))
      const fundObj = {total: parseInt(topup, 10), amount_split: newCurrDstrbn}
      callApi('/user/wallet/fund', fundObj, 'POST', user.token)
        .then(() => {
          this.setState({
            loadingTopup: false,
            topup: 10,
          })
          this.props.showFeedback(
            `$${parseInt(topup, 10)} Top-up made successfully`,
            'success',
          )
          this.toggleTopup()
        })
        .catch(() => {
          this.setState({loadingTopup: false})
          this.props.showFeedback(
            'Error making top-up, please check the amount and try again',
            'error',
          )
        })
    } else {
      this.props.showFeedback(
        'Error making top-up, please set minimum topup amount of $10 and try again',
        'error',
      )
    }
  }

  /**
   * Toggle withdrawal modal
   */
  toggleWithdraw = () => {
    const {withdrawModal} = this.state
    this.setState({
      withdrawModal: !withdrawModal,
    })
  }

  /**
   * Update selected coin in state
   * @param {object} val Selected coin
   */
  selectCoin = val => {
    this.setState({
      activeCoin: val,
    })
  }

  /**
   * Update withdrawal value in state
   * @param {object} e Global event object
   */
  updateWithdrawal = e => {
    const {value} = e.target
    const {activeCoin, btcVal, ethVal} = this.state
    if (activeCoin === 'btc' && btcVal > 0 && btcVal >= value) {
      this.setState({withdraw: value})
    }
    if (activeCoin === 'eth' && ethVal > 0 && ethVal >= value) {
      this.setState({withdraw: value})
    }
  }

  /**
   * Withdraw via API
   */
  fundsWithdraw = () => {
    const {user} = this.props
    const {withdraw, activeCoin} = this.state
    const coinList = {btc: 2, eth: 3}
    const walletId = coinList[activeCoin]
    this.setState({
      loadingWithdraw: true,
    })
    const withdrawObj = {amount: withdraw, user_wallet_id: walletId}
    callApi('/user/wallet/fund', withdrawObj, 'POST', user.token)
      .then(() => {
        this.setState({
          loadingWithdraw: false,
          withdraw: 0,
        })
        this.props.showFeedback(
          `$${withdraw} withdrawal made successfully`,
          'success',
        )
        this.toggleWithdraw()
      })
      .catch(() => {
        this.setState({loadingWithdraw: false})
        this.props.showFeedback(
          'Error making withdrawal, please check the amount and try again',
          'error',
        )
      })
  }

  /**
   * Toggle image upload
   */
  toggleImgUpload = () => {
    const {userDocumentModal} = this.state
    if (userDocumentModal) {
      this.updateDocUploadState()
    }
    this.setState({
      userDocumentModal: !userDocumentModal,
    })
  }

  /**
   * Update document upload in state
   * Used to ensure that the image upload popup only displays once per session for users who haven't done it yet
   */
  updateDocUploadState = () => {
    const userData = JSON.parse(localStorage.getItem('avenirApp'))
    Object.assign(userData, {docUploadState: true})
    const userDataStr = JSON.stringify(userData)
    localStorage.setItem('avenirApp', userDataStr)
  }

  /**
   * Specify ID type
   * @param {number} id ID indicator
   */
  specifyId = id => {
    if (id === 1) {
      this.setState({
        idType: 'individualProofOfAddress',
        userDocument: ['', ''],
      })
    } else {
      this.setState({
        idType: 'individualGovernmentId',
        userDocument: [''],
      })
    }
  }

  /**
   * Handle ID upload state update
   * @param {file} file Image file details
   * @param {object} body Image body details
   * @returns {object} setState with image updated
   */
  handleUserDocument = (file, body) => {
    const {idType, userDocument} = this.state
    if (idType === 'individualGovernmentId' && userDocument.length >= 1) {
      // Ensure there is only 1 image in the array
      userDocument.pop()
      return resizeImage(file, body).then(blob => {
        return this.setState(prevState => ({
          userDocument: [
            {
              src: URL.createObjectURL(blob),
              blob,
            },
            ...prevState.userDocument,
          ],
        }))
      })
    }
    if (idType === 'individualProofOfAddress') {
      return resizeImage(file, body).then(blob => {
        if (userDocument.length >= 1) {
          userDocument.pop()
          // Ensure there are only 2 images in the array
          if (userDocument.length === 2) {
            userDocument.pop()
          }
          return this.setState(prevState => ({
            userDocument: [
              {
                src: URL.createObjectURL(blob),
                blob,
              },
              ...prevState.userDocument,
            ],
          }))
        } else {
          return this.setState(prevState => ({
            userDocument: [
              {
                src: URL.createObjectURL(blob),
                blob,
              },
              ...prevState.userDocument,
            ],
          }))
        }
      })
    }
  }

  /**
   * Upload ID to SendWyre
   */
  submitUserDocument = () => {
    const {userDocument, idType} = this.state
    const {user} = this.props
    const selectedImages = userDocument.filter(photo => photo && photo.blob)
    if (selectedImages.length > 0) {
      const userDocObj = selectedImages.map(img => img.blob)[0]
      const userData = toFormData({document: userDocObj, type: idType})
      this.setState({loadingUpload: true})
      callApi('/user/sendwyre/document/upload', userData, 'POST', user.token)
        .then(res => {
          toast.success(`ID upload successful, ${res.data.message}`, {
            hideProgressBar: true,
          })
          this.setState({loadingUpload: false})
          callApi('/auth/me', null, 'GET', user.token)
            .then(response => {
              const userObj = {}
              Object.assign(userObj, {...response.data}, {token: user.token})
              this.props.updateUserData(userObj)
              this.toggleImgUpload()
            })
            .catch(() => {
              this.props.showFeedback(
                'Error updating user details, please reload',
                'error',
              )
            })
        })
        .catch(err => {
          const {
            data: {error},
          } = err
          this.setState({loadingUpload: false})
          Object.keys(error).map(obj => {
            return toast.error(error[obj][0], {hideProgressBar: true})
          })
        })
    } else {
      toast.error('Please select an image to upload', {hideProgressBar: true})
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

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      userDocument,
      userDocumentModal,
      loadingUpload,
      topupModal,
      topup,
      withdrawModal,
      withdraw,
      activeCoin,
      btcVal,
      ethVal,
      btcRate,
      ethRate,
      myCurrencyDistributions,
      walletTotal,
      loadingTopup,
      loadingWithdraw,
    } = this.state
    const {user} = this.props
    const externalTopupCloseBtn = (
      <button
        className="close"
        style={{position: 'absolute', top: '15px', right: '15px'}}
        onClick={this.toggleTopup}
      >
        &times;
      </button>
    )
    const externalWdlCloseBtn = (
      <button
        className="close"
        style={{position: 'absolute', top: '15px', right: '15px'}}
        onClick={this.toggleWithdraw}
      >
        &times;
      </button>
    )
    return (
      <Fragment>
        {this.renderRedirectToRoot()}
        <div className="">
          {/* preloader */}
          {this.props.loading && <Loader />}

          {/* Document upload */}
          {user.setup.documentUpload.done === false &&
          user.setup.documentUpload.status === 'OPEN' &&
          user.docUploadState === false ? (
            <DocumentUpload
              userDocumentModal={userDocumentModal}
              userDocument={userDocument}
              specifyId={this.specifyId}
              toggleImgUpload={this.toggleImgUpload}
              handleUserDocument={this.handleUserDocument}
              submitUserDocument={this.submitUserDocument}
              loadingUpload={loadingUpload}
            />
          ) : null}

          <Row className="page-title align-items-center">
            <Col md={2} className="trading-rates">
              <p className="mb-0 mt-0">Real-Time</p>
              <p className="mb-0 mt-0">Cryptocurrency</p>
              <p className="mb-0 mt-0">Trading rates</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="btc">
                <img src={btcImg} alt="Bitcoin" /> Bitcoin{' '}
                <span className="curr-price">
                  ${numberWithCommas(btcRate.toFixed(2))}
                </span>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div className="eth">
                <img src={ethImg} alt="Ethereum" /> Ethereum{' '}
                <span className="curr-price">
                  ${numberWithCommas(ethRate.toFixed(2))}
                </span>
              </div>
            </Col>
          </Row>

          {/* stats */}
          <WalletStatistics
            btcVal={`$${numberWithCommas(parseInt(btcVal, 10).toFixed(2))}`}
            ethVal={`$${numberWithCommas(parseInt(ethVal, 10).toFixed(2))}`}
            walletTotal={`$${numberWithCommas(walletTotal.toFixed(2))}`}
          />

          {/* charts */}
          <Row className="mb-4">
            <Col xl={7}>
              <Row>
                <Col md={4} className="text-center">
                  <Link
                    to="/transactions"
                    className="mr-1 mb-4 btn btn-block btn-inv-blue br-0"
                  >
                    View Rounds-Ups
                  </Link>
                </Col>
                <Col md={4} className="text-center">
                  <Button
                    color="inv-blue"
                    block
                    className="mr-1 mb-4 br-0"
                    onClick={this.toggleTopup}
                  >
                    Quick Wallet Top-Up
                  </Button>
                </Col>
                <Col md={4} className="text-center">
                  <Button
                    color="inv-blue"
                    block
                    className="mr-1 mb-4 br-0"
                    onClick={this.toggleWithdraw}
                  >
                    Withdraw Investment
                  </Button>
                </Col>
              </Row>
              <RevenueChart />
            </Col>
            <Col xl={5}>
              <InvestmentChart
                myCurrencyDistributions={myCurrencyDistributions}
                btcVal={`$${numberWithCommas(parseInt(btcVal, 10).toFixed(2))}`}
                ethVal={`$${numberWithCommas(parseInt(ethVal, 10).toFixed(2))}`}
              />
            </Col>
          </Row>

          {/* Top-up modal */}
          <Modal
            isOpen={topupModal}
            toggle={this.toggleTopup}
            external={externalTopupCloseBtn}
            centered
          >
            <ModalBody>
              <div className="text-center">
                <h4 className="wallet-topup mt-4">Wallet Top Up</h4>
                <p className="mt-4 mb-0">Top-ups are an easy way to</p>
                <p>make one-time minimum investments of $10</p>
                <img src={TopUp} alt="Top Up" className="img-fluid" />
                <h4>{`$${numberWithCommas(walletTotal.toFixed(2))}`}</h4>
                <p>Total Wallet Balance</p>
                <Form className="row" onSubmit={this.setTopup}>
                  <Col md={{offset: 2, size: 8}}>
                    <Input
                      name="topup"
                      type="number"
                      placeholder="Enter Amount"
                      onChange={this.updateTopup}
                      value={topup}
                    />
                  </Col>
                  <Col md={{offset: 2, size: 8}}>
                    <Row>
                      <Col md={6}>
                        <Button
                          color="inv-gray"
                          className="mr-2 mt-4 mb-4"
                          block
                          onClick={this.toggleTopup}
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col md={6}>
                        {loadingTopup ? (
                          <img
                            src={TopUpLoader}
                            alt="loader"
                            style={{height: '40px', marginTop: '20px'}}
                          />
                        ) : (
                          <Button
                            color="inv-blue"
                            className="mt-4 mb-4"
                            block
                            onClick={this.setTopup}
                          >
                            Fund Wallet
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Form>
              </div>
            </ModalBody>
          </Modal>

          {/* Withdrawal modal */}
          <Modal
            isOpen={withdrawModal}
            toggle={this.toggleWithdraw}
            external={externalWdlCloseBtn}
            centered
          >
            <ModalBody>
              <div className="text-center">
                <h4 className="wallet-topup mt-4 mb-0">Make a withdrawal</h4>
                <p className="mt-0 mb-4">Choose Cryptocurrency</p>
                <Row>
                  <Col md={{offset: 2, size: 4}}>
                    <div
                      className={classnames(
                        {'active-coin': activeCoin === 'btc'},
                        'img-box',
                        'text-center',
                      )}
                      onClick={() => this.selectCoin('btc')}
                      onKeyPress={() => this.selectCoin('btc')}
                    >
                      <img src={btcImg} alt="Bitcoin" className="img-fluid" />
                      <span>Bitcoin</span>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div
                      className={classnames(
                        {'active-coin': activeCoin === 'eth'},
                        'img-box',
                        'text-center',
                      )}
                      onClick={() => this.selectCoin('eth')}
                      onKeyPress={() => this.selectCoin('eth')}
                    >
                      <img src={ethImg} alt="Ethereum" className="img-fluid" />
                      <span>Ethereum</span>
                    </div>
                  </Col>
                </Row>
                <h4 className="mt-4">
                  ${activeCoin === 'btc' ? btcVal : ethVal}
                </h4>
                <Form className="row">
                  <Col md={{offset: 2, size: 8}}>
                    <Input
                      name="topup"
                      type="number"
                      placeholder="Enter Amount"
                      value={withdraw}
                      onChange={this.updateWithdrawal}
                    />
                  </Col>
                  <Col md={{offset: 2, size: 8}}>
                    <Row>
                      <Col md={6}>
                        <Button
                          color="inv-gray"
                          className="mr-2 mt-4 mb-4"
                          block
                          onClick={this.toggleWithdraw}
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col md={6}>
                        {loadingWithdraw ? (
                          <img
                            src={TopUpLoader}
                            alt="loader"
                            style={{height: '40px', marginTop: '20px'}}
                          />
                        ) : (
                          <Button
                            color="inv-blue"
                            className="mt-4 mb-4"
                            block
                            onClick={this.fundsWithdraw}
                          >
                            Withdraw
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Form>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user,
})

export default connect(mapStateToProps, {showFeedback, updateUserData})(
  Dashboard,
)

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ToastContainer, toast} from 'react-toastify'
import {array} from 'prop-types'
import 'react-toastify/dist/ReactToastify.css'

const options = {
  // toast.configure({
  autoClose: 8000,
  draggable: false,
}

class Toastr extends Component {
  render() {
    // <ToastContainer autoClose={8000} draggable={false} />
    // console.log(this.props.feedbacks)
    return (
      <div>
        <ToastContainer>
          {this.props.feedbacks.map(feedback =>
            toast(feedback.message, {
              // {this.props.feedbacks.map(feedback => toast[feedback.type](feedback.message, {
              // {this.props.feedbacks.map(feedback => this.refs.notificationAlert.notificationAlert({
              ...options,
              // autoClose: feedback.autoClose ? feedback.autoClose : 5,
              className: feedback.color,
              hideProgressBar: true,
              // icon:
              //   feedback.color === 'danger'
              //     ? 'tim-icons icon-alert-circle-exc'
              //     : feedback.color === 'success'
              //       ? 'tim-icons icon-check-2'
              //       : 'tim-icons icon-bell-55',
            }),
          )}
        </ToastContainer>
      </div>
    )
  }
}

Toastr.defaultProps = {
  feedbacks: [],
}

Toastr.propTypes = {
  feedbacks: array,
}

// const mapStateToProps = state => ({
const mapStateToProps = state => ({
  feedbacks: state.Layout.feedbacks,
})

export default connect(mapStateToProps)(Toastr)

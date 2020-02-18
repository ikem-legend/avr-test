import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ToastContainer, toast} from 'react-toastify'
import {array} from 'prop-types'
import 'react-toastify/dist/ReactToastify.css'

const options = {
  autoClose: 8000,
  draggable: false,
}

class Toastr extends Component {
  render() {
    return (
      <div>
        <ToastContainer>
          {this.props.feedbacks.map(feedback =>
            toast(feedback.message, {
              ...options,
              className: feedback.color,
              hideProgressBar: true,
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

const mapStateToProps = state => ({
  feedbacks: state.Layout.feedbacks,
})

export default connect(mapStateToProps)(Toastr)

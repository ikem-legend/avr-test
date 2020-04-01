import React, {Component, Fragment} from 'react'
import {withRouter} from 'react-router-dom'

class Faq extends Component {
  componentDidMount() {
    window.open('http://avenir-app.com/faq')
    this.props.history.goBack()
  }
  render() {
  	return (
  		<Fragment />
  	)
  }
}

export default withRouter(Faq)
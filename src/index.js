import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import App from './App'
import Toastr from './components/Toastr'
import * as serviceWorker from './serviceWorker'

import {configureStore} from './redux/store'

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
    <Toastr />
  </Provider>,
  document.getElementById('root'),
)

serviceWorker.unregister()

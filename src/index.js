import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import App from './App'
import Toastr from './components/Toastr'
import * as serviceWorker from './serviceWorker'

import {configureStore} from './redux/store'
const {store, persistor} = configureStore()

ReactDOM.render(
  <Provider store={store}>
  	<PersistGate loading={null} persistor={persistor}>
	    <App />
	    <Toastr />
	  </PersistGate>
  </Provider>,
  document.getElementById('root'),
)

serviceWorker.unregister()

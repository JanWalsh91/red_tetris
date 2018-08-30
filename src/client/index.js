import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import {storeStateMiddleWare} from './middleware/storeStateMiddleWare'
import reducer from './reducers'
import App from './containers/app/app'
import {alert} from './actions/client'

const initialState = {
	message: 'Soon, will be here a fantastic Tetris ...',
	socket: {},
	hostList: []
}

const store = createStore(
	reducer,
	initialState,
	applyMiddleware(thunk, createLogger())
)

ReactDom.render((
	<Provider store={store}>
		<App/>
	</Provider>
), document.getElementById('tetris'))

export default store

// store.dispatch(alert('Soon, will be here a fantastic Tetris ...'))

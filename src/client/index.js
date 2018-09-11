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
	hostList: [],
	playerName: '',
	gameSelected: null, // Null / #
	gameJoined: false, // True / False
	isHost: false,
	gameState: {
		score: 0,
		level: 0,
		cells: undefined,
		lines: 0,
		nextPieces: undefined
	}
}

// prod: (without Redux DevTools)
// const store = createStore(
// 	reducer,
// 	initialState,
// 	applyMiddleware(thunk, createLogger())
// )

// dev: (to make work with Redux DevTools)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancers(
	applyMiddleware(thunk, createLogger())
))

ReactDom.render((
	<Provider store={store}>
		<App/>
	</Provider>
), document.getElementById('tetris'))

export default store

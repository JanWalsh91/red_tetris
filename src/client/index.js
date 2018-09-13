import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import {storeStateMiddleWare} from './middleware/storeStateMiddleWare'
import App from './containers/app/app'
import {alert} from './actions/client'
import store from './store'
// prod: (without Redux DevTools)


// dev: (to make work with Redux DevTools)

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(reducer, initialState, composeEnhancers(
// 	applyMiddleware(thunk, createLogger())
// ))

ReactDom.render((
	<Provider store={store}>
		<App/>
	</Provider>
), document.getElementById('tetris'))

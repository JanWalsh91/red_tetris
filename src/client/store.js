import initialState from './initialState'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import reducer from './reducers'


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancers(
	applyMiddleware(thunk, createLogger())
))

// const store = createStore(
// 	reducer,
// 	initialState,
// 	applyMiddleware(thunk, createLogger())
// )

export default store

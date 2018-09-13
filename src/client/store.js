import reducer from './reducers'
import initialState from './initialState'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'


const store = createStore(
	reducer,
	initialState,
	applyMiddleware(thunk, createLogger())
)

export default store

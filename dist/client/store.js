'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _initialState = require('./initialState');

var _initialState2 = _interopRequireDefault(_initialState);

var _redux = require('redux');

var _storeStateMiddleWare = require('./middleware/storeStateMiddleWare');

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _params = require('../../params');

var _params2 = _interopRequireDefault(_params);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socket = _socket2.default.connect(_params2.default.server.getUrl());
// import createLogger from 'redux-logger'


var composeEnhancers = _redux.compose;
if (process.env.NODE_ENV != 'production') {
	composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;
}

var store = (0, _redux.createStore)(_reducers2.default, _initialState2.default, composeEnhancers((0, _redux.applyMiddleware)((0, _storeStateMiddleWare.storeStateMiddleWare)(socket))));

exports.default = store;
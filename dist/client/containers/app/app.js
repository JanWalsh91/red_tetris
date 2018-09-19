'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _app = require('./app.css');

var _app2 = _interopRequireDefault(_app);

var _button = require('../../components/button/button');

var _button2 = _interopRequireDefault(_button);

var _headerBar = require('../../components/headerBar/headerBar');

var _headerBar2 = _interopRequireDefault(_headerBar);

var _instructions = require('../../components/instructions/instructions');

var _instructions2 = _interopRequireDefault(_instructions);

var _main = require('./main/main');

var _main2 = _interopRequireDefault(_main);

var _Modal = require('../../components/Modal/Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _client = require('../../actions/client');

var _serverActions = require('../../../server/serverActions');

var ActionNames = _interopRequireWildcard(_serverActions);

var _server = require('../../actions/server');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App(props) {

	function KeyboardController(keys, repeat) {
		var timers = {};
		var locked = {};

		var lockedKey = [38, 32, 48, 96];

		document.onkeydown = function (event) {
			if (props.gameJoined) {
				var key = event.keyCode;
				if (!(key in keys) || !repeat) {
					return true;
				}
				if (lockedKey.includes(key)) {
					if (!(key in locked)) {
						keys[key]();
						locked[key] = key;
					}
				} else if (!(key in timers)) {
					timers[key] = null;
					keys[key]();
					timers[key] = setInterval(keys[key], repeat);
				}
			}
		};

		document.onkeyup = function (event) {
			var key = event.keyCode;
			if (key in timers) {
				if (timers[key] != null) {
					clearInterval(timers[key]);
					delete timers[key];
				}
			} else if (key in locked) {
				delete locked[key];
			}
		};
	}

	KeyboardController({
		32: function _() {
			props.serverGameAction("downShortcut");
		},
		37: function _() {
			props.serverGameAction("left");
		},
		38: function _() {
			props.serverGameAction("rotate");
		},
		39: function _() {
			props.serverGameAction("right");
		},
		40: function _() {
			props.serverGameAction("down");
		},
		48: function _() {
			props.serverGameAction("savePiece");
		},
		96: function _() {
			props.serverGameAction("savePiece");
		}

	}, 125);

	if (props.errorMessage) {
		return _react2.default.createElement(
			'div',
			{ className: _app2.default.error },
			_react2.default.createElement(
				'span',
				null,
				'ERROR : ',
				props.errorMessage
			)
		);
	}

	var instructions = null;

	if (props.showInstructions) {
		instructions = _react2.default.createElement(_instructions2.default, null);
	}

	return _react2.default.createElement(
		'div',
		{ className: _app2.default.app, tabIndex: '0' },
		_react2.default.createElement(_headerBar2.default, null),
		_react2.default.createElement(_main2.default, null),
		_react2.default.createElement(_button2.default, { value: 'i', onClick: props.toggleInstructions }),
		_react2.default.createElement(
			_Modal2.default,
			{ show: props.showInstructions, modalClosed: props.toggleInstructions },
			instructions
		)
	);
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		gameJoined: state.gameJoined,
		errorMessage: state.errorMessage,
		showInstructions: state.showInstructions
	};
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
	return {
		toggleInstructions: function toggleInstructions() {
			return dispatch((0, _client.toggleInstructions)());
		},

		serverGameAction: function serverGameAction(gameAction) {
			return dispatch((0, _server.serverGameAction)(gameAction));
		}
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(App);
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _playerForm = require('./playerForm.css');

var _playerForm2 = _interopRequireDefault(_playerForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PlayerForm = function PlayerForm(props) {

	var keyboardEvent = function keyboardEvent(event) {
		if (event.keyCode == 13) {
			props.onUpdateName();
		}
	};

	return _react2.default.createElement(
		'div',
		{ className: _playerForm2.default.playerForm },
		_react2.default.createElement('input', { onKeyDown: keyboardEvent, type: 'text', id: 'playerInputName', placeholder: 'Enter your username' }),
		_react2.default.createElement('input', { id: 'buttonPlayerInputName', value: 'Play', type: 'button', onClick: props.onUpdateName })
	);
};

exports.default = PlayerForm;
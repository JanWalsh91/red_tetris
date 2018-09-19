'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _button = require('./button.css');

var _button2 = _interopRequireDefault(_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var button = function button(props) {
	return _react2.default.createElement('input', { type: 'button', className: _button2.default.Button, onClick: props.onClick, value: props.value });
};

exports.default = button;
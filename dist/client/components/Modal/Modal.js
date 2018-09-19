'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Modal = require('./Modal.css');

var _Modal2 = _interopRequireDefault(_Modal);

var _Backdrop = require('../Backdrop/Backdrop');

var _Backdrop2 = _interopRequireDefault(_Backdrop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modal = function modal(props) {
	return _react2.default.createElement(
		'div',
		null,
		_react2.default.createElement(_Backdrop2.default, { show: props.show, clicked: props.modalClosed }),
		_react2.default.createElement(
			'div',
			{
				className: _Modal2.default.Modal,
				style: {
					transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
					opacity: props.show ? '1' : '0'
				} },
			props.children
		)
	);
};

exports.default = modal;
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Backdrop = require('./Backdrop.css');

var _Backdrop2 = _interopRequireDefault(_Backdrop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var backdrop = function backdrop(props) {
	return props.show ? _react2.default.createElement('div', { className: _Backdrop2.default.Backdrop, onClick: props.clicked }) : null;
};

exports.default = backdrop;
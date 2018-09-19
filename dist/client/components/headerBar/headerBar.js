'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _headerBar = require('./headerBar.css');

var _headerBar2 = _interopRequireDefault(_headerBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var headerBar = function headerBar() {

	return _react2.default.createElement(
		'div',
		{ className: _headerBar2.default.headerContainer },
		_react2.default.createElement(
			'h1',
			null,
			'RED TETRIS'
		)
	);
};

exports.default = headerBar;
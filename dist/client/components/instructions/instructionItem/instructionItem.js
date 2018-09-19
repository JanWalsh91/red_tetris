'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _instructionItem = require('./instructionItem.css');

var _instructionItem2 = _interopRequireDefault(_instructionItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instructionItem = function instructionItem(props) {
	if (props.instruction == undefined || props.instruction.name == undefined || props.instruction.instruction == undefined) return null;
	return _react2.default.createElement(
		'div',
		{ className: _instructionItem2.default.InstructionItem },
		_react2.default.createElement(
			'div',
			{ className: _instructionItem2.default.name },
			props.instruction.name
		),
		_react2.default.createElement(
			'div',
			{ className: _instructionItem2.default.instruction },
			props.instruction.instruction
		)
	);
};

exports.default = instructionItem;
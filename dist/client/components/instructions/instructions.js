'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _instructions = require('./instructions.css');

var _instructions2 = _interopRequireDefault(_instructions);

var _instructionItem = require('./instructionItem/instructionItem');

var _instructionItem2 = _interopRequireDefault(_instructionItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instructions = function instructions() {

	var list = [{
		name: 'space',
		instruction: 'Hard drop'
	}, {
		name: '↑',
		instruction: 'Rotate'
	}, {
		name: '←',
		instruction: 'Move left'
	}, {
		name: '→',
		instruction: 'Move right'
	}, {
		name: '↓',
		instruction: 'Soft drop'
	}, {
		name: '0',
		instruction: 'Hold piece'
	}];

	var instructionsList = [];
	instructionsList = list.map(function (instruction) {
		return _react2.default.createElement(_instructionItem2.default, { key: instruction.name, instruction: instruction });
	});

	instructionsList = _react2.default.createElement(
		'div',
		{ className: _instructions2.default.instructionlist },
		instructionsList
	);

	return _react2.default.createElement(
		'div',
		{ className: _instructions2.default.Instructions },
		_react2.default.createElement(
			'h3',
			null,
			'Instructions'
		),
		instructionsList
	);
};

exports.default = instructions;
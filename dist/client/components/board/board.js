'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _board = require('./board.css');

var _board2 = _interopRequireDefault(_board);

var _cell = require('../cell/cell.css');

var _cell2 = _interopRequireDefault(_cell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var board = function board(props) {
	var content = _react2.default.createElement(
		'div',
		null,
		'EMPTY BOARD'
	);

	var cellClasses = [];
	cellClasses.push(_cell2.default.cell);

	if (props.gameState && props.gameState.cells != undefined) {
		content = props.gameState.cells.map(function (row, rIndex) {

			var line = row.map(function (cell, cIndex) {
				var classes = [].concat(cellClasses);
				classes.push(_cell2.default[cell]);
				classes = classes.join(' ');
				return _react2.default.createElement('div', { key: (rIndex + 1) * (cIndex + 1), className: classes });
			});
			line = _react2.default.createElement(
				'div',
				{ key: rIndex, className: _board2.default.row },
				line
			);
			return line;
		});
	}

	return _react2.default.createElement(
		'div',
		{ className: _board2.default.Board },
		content
	);
};

exports.default = board;
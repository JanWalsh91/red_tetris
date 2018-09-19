'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _savedPiece = require('./savedPiece.css');

var _savedPiece2 = _interopRequireDefault(_savedPiece);

var _cell = require('../../cell/cell.css');

var _cell2 = _interopRequireDefault(_cell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var savedPiece = function savedPiece(props) {

	var cellClasses = [];
	cellClasses.push(_cell2.default.cell);

	var cellContent = null;
	var rowContent = [];

	for (var y = 0; y < 4; y++) {
		cellContent = [];
		for (var x = 0; x < 4; x++) {
			var classes = [].concat(cellClasses);

			if (props.piece && props.piece.cells && props.piece.cells[y] && props.piece.cells[y][x]) {
				classes.push(_cell2.default[props.piece.cells[y][x]]);
			}
			classes = classes.join(' ');
			cellContent.push(_react2.default.createElement('div', { key: (x + 1) * (y + 1), className: classes }));
		}
		rowContent.push(_react2.default.createElement(
			'div',
			{ className: _savedPiece2.default.row, key: y },
			cellContent
		));
	}

	return _react2.default.createElement(
		'div',
		{ className: _savedPiece2.default.savedPiece },
		rowContent
	);
};

exports.default = savedPiece;
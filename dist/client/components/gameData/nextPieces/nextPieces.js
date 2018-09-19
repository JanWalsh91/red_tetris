'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _nextPieces = require('./nextPieces.css');

var _nextPieces2 = _interopRequireDefault(_nextPieces);

var _cell = require('../../cell/cell.css');

var _cell2 = _interopRequireDefault(_cell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nextPieces = function nextPieces(props) {
	var cellClasses = [];
	cellClasses.push(_cell2.default.cell);

	var cellContent = null;
	var rowContent = [];
	var pieces = [];

	for (var n = 0; n < 3; n++) {
		rowContent = [];
		for (var y = 0; y < 4; y++) {
			cellContent = [];
			for (var x = 0; x < 4; x++) {
				var classes = [].concat(cellClasses);

				if (props.pieces && props.pieces[n] && props.pieces[n].cells && props.pieces[n].cells[y] && props.pieces[n].cells[y][x]) {
					classes.push(_cell2.default[props.pieces[n].cells[y][x]]);
				}
				classes = classes.join(' ');
				cellContent.push(_react2.default.createElement('div', { key: (x + 1) * (y + 1), className: classes }));
			}
			rowContent.push(_react2.default.createElement(
				'div',
				{ key: y },
				cellContent
			));
		}
		pieces.push(_react2.default.createElement(
			'div',
			{ className: _nextPieces2.default.piece, key: n },
			rowContent
		));
	}

	return _react2.default.createElement(
		'div',
		{ className: _nextPieces2.default.nextPieces },
		pieces
	);
};

exports.default = nextPieces;
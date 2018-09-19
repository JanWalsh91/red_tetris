'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shadowBoard = require('./shadowBoard.css');

var _shadowBoard2 = _interopRequireDefault(_shadowBoard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shadowBoard = function shadowBoard(props) {
	var content = _react2.default.createElement(
		'div',
		null,
		'EMPTY BOARD'
	);
	var info = '';
	var shadowCellClasses = [];
	shadowCellClasses.push(_shadowBoard2.default.shadowCell);

	var contentArray = [];
	if (props.shadowState) {
		props.shadowState.forEach(function (shadowBoard, sbIndex) {
			if (shadowBoard.id == props.playerUUID) return;
			var board = shadowBoard.board.map(function (row, rIndex) {
				var line = row.map(function (cell, cIndex) {
					var classes = [].concat(shadowCellClasses);
					classes.push(_shadowBoard2.default[cell]);
					classes = classes.join(' ');

					return _react2.default.createElement('div', { key: (rIndex + 1) * (cIndex + 1), className: classes });
				});
				line = _react2.default.createElement(
					'div',
					{ key: rIndex, className: _shadowBoard2.default.row },
					line
				);
				return line;
			});

			var fontSize = '100%';
			if (shadowBoard.name.length > 8) {
				fontSize = '60%';
			}

			contentArray.push(_react2.default.createElement(
				'div',
				{ className: _shadowBoard2.default.shadowBoard, key: sbIndex },
				_react2.default.createElement(
					'div',
					{ className: _shadowBoard2.default.board },
					board
				),
				_react2.default.createElement(
					'div',
					{ className: _shadowBoard2.default.info },
					_react2.default.createElement(
						'div',
						{ className: _shadowBoard2.default.name, style: { fontSize: fontSize } },
						decodeURIComponent(shadowBoard.name)
					),
					_react2.default.createElement(
						'div',
						null,
						'Score: ',
						shadowBoard.score
					)
				)
			));
		});
	}

	return _react2.default.createElement(
		'div',
		{ className: _shadowBoard2.default.ShadowBoards },
		contentArray
	);
};

exports.default = shadowBoard;
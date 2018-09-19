'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _gameData = require('./gameData.css');

var _gameData2 = _interopRequireDefault(_gameData);

var _nextPieces = require('./nextPieces/nextPieces');

var _nextPieces2 = _interopRequireDefault(_nextPieces);

var _savedPiece = require('./savedPiece/savedPiece');

var _savedPiece2 = _interopRequireDefault(_savedPiece);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gameData = function gameData(props) {
	var cellClasses = [];
	cellClasses.push(_gameData2.default.cell);

	var content = null;

	if (props.gameData) {
		return _react2.default.createElement(
			'div',
			{ className: _gameData2.default.GameData },
			_react2.default.createElement(_savedPiece2.default, { piece: props.gameData.savedPiece }),
			_react2.default.createElement(_nextPieces2.default, { pieces: props.gameData.nextPieces }),
			_react2.default.createElement(
				'div',
				{ className: _gameData2.default.score },
				'Score: ',
				props.gameData.score
			),
			_react2.default.createElement(
				'div',
				{ className: _gameData2.default.level },
				'Level: ',
				props.gameData.level + 1
			),
			_react2.default.createElement(
				'div',
				{ className: _gameData2.default.removedLines },
				'Lines: ',
				props.gameData.removedLines
			)
		);
	}

	return null;
};

exports.default = gameData;
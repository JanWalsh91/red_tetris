'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _endGameLeaderBoard = require('./endGameLeaderBoard.css');

var _endGameLeaderBoard2 = _interopRequireDefault(_endGameLeaderBoard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var endGameLeaderBoard = function endGameLeaderBoard(props) {
	var leaderBoard = null;

	if (props.playersLostList != undefined && props.playersInfo != undefined && props.playersInfo.size > 0) {
		var bestScore = Math.max.apply(Math, [].concat(_toConsumableArray(props.playersInfo.values())).map(function (o) {
			return o.score;
		}));

		leaderBoard = props.playersLostList.map(function (uuid) {
			var player = props.playersInfo.get(uuid);
			var playerName = (player.score == bestScore ? '*' : '') + player.name;

			return _react2.default.createElement(
				'div',
				{ key: player.id, className: _endGameLeaderBoard2.default.rankPosition },
				_react2.default.createElement(
					'span',
					null,
					playerName
				),
				_react2.default.createElement(
					'span',
					null,
					player.score
				)
			);
		});

		leaderBoard = _react2.default.createElement(
			'div',
			{ className: _endGameLeaderBoard2.default.scoreRanking },
			_react2.default.createElement(
				'h3',
				null,
				'Score'
			),
			leaderBoard
		);
	}

	var status = null;
	if (props.playersLostList != undefined && props.playersLostList.length == 1 || props.isWinner == false) {
		status = _react2.default.createElement(
			'h2',
			null,
			'You lose...'
		);
	} else {
		status = _react2.default.createElement(
			'h2',
			null,
			'You win!'
		);
	}

	return _react2.default.createElement(
		'div',
		{ className: _endGameLeaderBoard2.default.endGameLeaderBoard },
		status,
		leaderBoard
	);
};

exports.default = endGameLeaderBoard;
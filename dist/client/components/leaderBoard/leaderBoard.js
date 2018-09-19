'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _leaderBoard = require('./leaderBoard.css');

var _leaderBoard2 = _interopRequireDefault(_leaderBoard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var leaderBoard = function leaderBoard(props) {

	var leaderBoard = null;
	if (props.players) {
		leaderBoard = props.players.map(function (player, index) {
			return _react2.default.createElement(
				'div',
				{ key: index, className: _leaderBoard2.default.rankingRow },
				_react2.default.createElement(
					'span',
					null,
					player.playerName
				),
				_react2.default.createElement(
					'span',
					null,
					player.score
				)
			);
		});
	}

	return _react2.default.createElement(
		'div',
		{ className: _leaderBoard2.default.LeaderBoard },
		_react2.default.createElement(
			'h3',
			null,
			'Leader Board'
		),
		_react2.default.createElement(
			'div',
			{ className: _leaderBoard2.default.ranking },
			leaderBoard
		)
	);
};

exports.default = leaderBoard;
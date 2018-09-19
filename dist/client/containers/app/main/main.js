'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _main = require('./main.css');

var _main2 = _interopRequireDefault(_main);

var _playerForm = require('../../../components/playerForm/playerForm');

var _playerForm2 = _interopRequireDefault(_playerForm);

var _leaderBoard = require('../../../components/leaderBoard/leaderBoard');

var _leaderBoard2 = _interopRequireDefault(_leaderBoard);

var _hostList = require('../../../components/hostList/hostList');

var _hostList2 = _interopRequireDefault(_hostList);

var _board = require('../../../components/board/board');

var _board2 = _interopRequireDefault(_board);

var _shadowBoard = require('../../../components/shadowBoard/shadowBoard');

var _shadowBoard2 = _interopRequireDefault(_shadowBoard);

var _endGameLeaderBoard = require('../../../components/endGameLeaderBoard/endGameLeaderBoard');

var _endGameLeaderBoard2 = _interopRequireDefault(_endGameLeaderBoard);

var _gameData = require('../../../components/gameData/gameData');

var _gameData2 = _interopRequireDefault(_gameData);

var _button = require('../../../components/button/button');

var _button2 = _interopRequireDefault(_button);

var _client = require('../../../actions/client');

var _server = require('../../../actions/server');

var _serverActions = require('../../../../server/serverActions');

var ActionNames = _interopRequireWildcard(_serverActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Main = function Main(props) {
	var startGame = function startGame() {
		props.serverStartGame();
		document.getElementById('audio').loop = true;
		document.getElementById('audio').play();
	};

	var quitGame = function quitGame() {
		document.getElementById('audio').loop = false;
		document.getElementById('audio').currentTime = 0.0;
		document.getElementById('audio').pause();
		props.serverQuitGame();
		props.resetState({ playerName: props.playerName });
		window.history.pushState(null, '', '/');
	};

	var updateName = function updateName() {
		var name = document.getElementById('playerInputName').value;

		if (name != undefined && name.length > 0) {
			props.serverAddNewPlayerToLobby(name);
			props.onUpdatePlayerName(name);
		}
	};

	var updateInvisibleMode = function updateInvisibleMode() {
		var isInvisibleMode = document.getElementById('invisibleMode').checked;
		props.serverUpdateInvisibleMode(isInvisibleMode);
		props.updateInvisibleMode(isInvisibleMode);
	};

	var buttons = null;
	var content = null;

	if (props.playerName === undefined || props.playerName.length == 0) {
		content = _react2.default.createElement(
			'div',
			{ className: _main2.default.playerFormContainer },
			_react2.default.createElement(_playerForm2.default, { onUpdateName: updateName }),
			_react2.default.createElement(_leaderBoard2.default, { players: props.leaderBoard })
		);
	} else {
		var startButton = null;
		var invisibleMode = null;
		if (props.isHost) {
			if (!props.gameStart) {
				startButton = _react2.default.createElement(_button2.default, { onClick: startGame, value: 'Start Game' });
				invisibleMode = _react2.default.createElement(
					'span',
					null,
					_react2.default.createElement('input', { id: 'invisibleMode', onChange: updateInvisibleMode, type: 'checkbox', checked: !!props.invisibleMode }),
					_react2.default.createElement(
						'label',
						{ htmlFor: 'invisibleMode' },
						'Invisible Mode'
					)
				);
			}
		} else {
			if (props.gameStart) {
				if (document.getElementById('audio').paused) {
					document.getElementById('audio').play();
				}
			}
		}

		if (props.gameJoined) {
			buttons = _react2.default.createElement(
				'div',
				{ className: _main2.default.buttons },
				_react2.default.createElement(
					'div',
					null,
					startButton,
					_react2.default.createElement(_button2.default, { id: 'quitGameButton', onClick: quitGame, value: 'Quit Game' })
				),
				_react2.default.createElement(
					'div',
					null,
					invisibleMode
				)
			);
		}

		var endGameContent = null;
		if (props.endGame) {
			endGameContent = _react2.default.createElement(_endGameLeaderBoard2.default, {
				uuid: props.playerUUID,
				isWinnerByScore: props.isWinnerByScore,
				isWinner: props.isWinner,
				playersInfo: props.shadowState,
				playersLostList: props.playersLostList
			});
		}

		if (props.gameJoined) {
			content = _react2.default.createElement(
				'div',
				{ className: _main2.default.gameArea },
				_react2.default.createElement(
					'div',
					{ className: _main2.default.shadowBoard },
					_react2.default.createElement(_shadowBoard2.default, { playerUUID: props.playerUUID, shadowState: props.shadowState })
				),
				_react2.default.createElement(
					'div',
					{ className: _main2.default.boardWrapper },
					_react2.default.createElement(_board2.default, { gameState: props.gameState }),
					endGameContent
				),
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(_gameData2.default, { gameData: props.gameState })
				),
				_react2.default.createElement(
					'audio',
					{ controls: true, loop: 'true', id: 'audio', className: _main2.default.audio },
					_react2.default.createElement('source', { src: '/public/mainTheme.mp3', type: 'audio/mpeg' })
				)
			);
		} else {
			content = _react2.default.createElement(_hostList2.default, {
				hostList: props.hostList,
				gameSelected: props.gameSelected,
				onSelectGame: props.onSelectGame,
				createGame: props.serverCreateGame,
				joinGame: props.serverJoinGame });
		}
	}
	return _react2.default.createElement(
		'div',
		{ className: _main2.default.main },
		content,
		buttons
	);
};

var mapStateToProps = function mapStateToProps(state) {

	return {
		hostList: state.hostList,
		playerName: state.playerName,
		gameSelected: state.gameSelected,
		gameJoined: state.gameJoined,
		gameState: state.gameState,
		shadowState: state.shadowState,
		isHost: state.isHost,
		playerUUID: state.playerUUID,
		gameStart: state.gameStart,
		isWinner: state.isWinner,
		isWinnerByScore: state.isWinnerByScore,
		endGame: state.endGame,
		leaderBoard: state.leaderBoard,
		invisibleMode: state.invisibleMode,
		playersLostList: state.playersLostList
	};
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
	return {
		serverAddNewPlayerToLobby: function serverAddNewPlayerToLobby(name) {
			return dispatch((0, _server.serverAddNewPlayerToLobby)(name));
		},
		serverStartGame: function serverStartGame() {
			return dispatch((0, _server.serverStartGame)());
		},
		serverQuitGame: function serverQuitGame() {
			return dispatch((0, _server.serverQuitGame)());
		},
		serverUpdateInvisibleMode: function serverUpdateInvisibleMode(isInvisibleMode) {
			return dispatch((0, _server.serverUpdateInvisibleMode)(isInvisibleMode));
		},

		onUpdatePlayerName: function onUpdatePlayerName(playerName) {
			return dispatch((0, _client.updatePlayerName)(playerName));
		},
		onSelectGame: function onSelectGame(hostID) {
			return dispatch((0, _client.updateSelectedGame)(hostID));
		},
		onUpdateGameJoined: function (_onUpdateGameJoined) {
			function onUpdateGameJoined(_x) {
				return _onUpdateGameJoined.apply(this, arguments);
			}

			onUpdateGameJoined.toString = function () {
				return _onUpdateGameJoined.toString();
			};

			return onUpdateGameJoined;
		}(function (gameJoined) {
			return dispatch(onUpdateGameJoined(gameJoined));
		}),
		resetState: function resetState(action) {
			return dispatch((0, _client.resetState)(action));
		},
		updateInvisibleMode: function updateInvisibleMode(isInvisibleMode) {
			return dispatch((0, _client.updateInvisibleMode)(isInvisibleMode));
		},
		serverCreateGame: function serverCreateGame() {
			return dispatch((0, _server.serverCreateGame)());
		},
		serverJoinGame: function serverJoinGame(gameSelected) {
			return dispatch((0, _server.serverJoinGame)(gameSelected));
		}
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Main);
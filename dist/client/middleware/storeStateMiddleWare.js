'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.storeStateMiddleWare = undefined;

var _serverActions = require('../../server/serverActions');

var ActionNames = _interopRequireWildcard(_serverActions);

var _server = require('../actions/server');

var _client = require('../actions/client');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var storeStateMiddleWare = exports.storeStateMiddleWare = function storeStateMiddleWare(socket) {
	return function (_ref) {
		var dispatch = _ref.dispatch,
		    getState = _ref.getState;

		// set socket.io listeners and dispatch
		socket.on(ActionNames.UPDATE_HOST_LIST, function (hostList) {
			dispatch((0, _client.updateHostList)(hostList));
		});

		socket.on(ActionNames.UPDATE_GAME_JOINED, function (action) {
			updateHash(getState().playerName, action.gameID);
			dispatch((0, _client.updateGameJoined)(action));
		});

		socket.on(ActionNames.UPDATE_GAME_START, function () {
			dispatch((0, _client.updateGameStart)());
		});

		socket.on(ActionNames.UPDATE_GAME_STATE, function (gameState) {
			dispatch((0, _client.updateGameState)(gameState));
		});

		socket.on(ActionNames.UPDATE_SHADOW_STATE, function (shadowCellsData) {
			dispatch((0, _client.updateShadowState)(shadowCellsData));
		});

		socket.on(ActionNames.UPDATE_HOST_STATUS, function (isHost) {
			dispatch((0, _client.updateHostStatus)(isHost));
		});

		socket.on(ActionNames.UPDATE_PLAYER_UUID, function (playerUUID) {
			dispatch((0, _client.updatePlayerUUID)(playerUUID));
		});

		socket.on(ActionNames.UPDATE_PLAYER_NAME, function (playerName) {
			dispatch((0, _client.updatePlayerName)(playerName));
		});

		socket.on(ActionNames.IS_WINNER, function () {
			dispatch((0, _client.isWinner)());
		});

		socket.on(ActionNames.END_GAME, function (playersLostList) {
			dispatch((0, _client.endGame)(playersLostList));
		});

		socket.on("connect", function () {
			readHash();
			dispatch((0, _client.updateError)(null));
		});

		socket.on("disconnect", function () {
			updateHash();
			dispatch((0, _client.updateError)("500"));
		});

		socket.on(ActionNames.UPDATE_LEADER_BOARD, function (leaderBoard) {
			dispatch((0, _client.updateLeaderBoard)(leaderBoard));
		});

		socket.on(ActionNames.SEND_ERROR_STATUS, function (errorMessage) {
			dispatch((0, _client.updateError)(errorMessage));
		});

		var readHash = function readHash() {
			var regexPlayerRoom = /#(\d+)\[(.+)\]/;
			var url = window.location.hash;

			var match = regexPlayerRoom.exec(url);
			if (!!match) {
				var gameID = match[1];
				var playerName = match[2];
				if (gameID == getState().gameID && playerName == getState().playerName) return;
				dispatch((0, _client.resetState)());
				socket.emit(_server.SERVER_UPDATE_REQUEST_URL, { gameID: gameID, playerName: decodeURIComponent(playerName) });
			}
		};

		var updateHash = function updateHash(playerName, gameID) {
			if (!playerName || !gameID) {
				try {
					window.location.href = '/';
				} catch (e) {
					console.log("href assign error");
				}
			} else {
				try {
					window.location.hash = gameID + '[' + playerName + ']';
				} catch (e) {
					console.log("href assign error");
				}
			}
		};

		window.onhashchange = readHash;

		return function (next) {
			return function (action) {
				// handle server emit actions
				if (socket) {
					if (action.type.includes("SERVER")) {
						socket.emit(action.type, action.payload);
					}
				}
				return next(action);
			};
		};
	};
};
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var SERVER_CREATE_GAME = exports.SERVER_CREATE_GAME = 'SERVER_CREATE_GAME';

var serverCreateGame = exports.serverCreateGame = function serverCreateGame() {
	return {
		type: SERVER_CREATE_GAME
	};
};

var SERVER_JOIN_GAME = exports.SERVER_JOIN_GAME = 'SERVER_JOIN_GAME';

var serverJoinGame = exports.serverJoinGame = function serverJoinGame(gameSelected) {
	return {
		type: SERVER_JOIN_GAME,
		payload: gameSelected
	};
};

var SERVER_GAME_ACTION = exports.SERVER_GAME_ACTION = 'SERVER_GAME_ACTION';

var serverGameAction = exports.serverGameAction = function serverGameAction(gameAction) {
	return {
		type: SERVER_GAME_ACTION,
		payload: gameAction
	};
};

var SERVER_START_GAME = exports.SERVER_START_GAME = 'SERVER_START_GAME';

var serverStartGame = exports.serverStartGame = function serverStartGame() {
	return {
		type: SERVER_START_GAME
	};
};

var SERVER_QUIT_GAME = exports.SERVER_QUIT_GAME = 'SERVER_QUIT_GAME';

var serverQuitGame = exports.serverQuitGame = function serverQuitGame() {
	return {
		type: SERVER_QUIT_GAME
	};
};

var SERVER_ADD_NEW_PLAYER_TO_LOBBY = exports.SERVER_ADD_NEW_PLAYER_TO_LOBBY = 'SERVER_ADD_NEW_PLAYER_TO_LOBBY';

var serverAddNewPlayerToLobby = exports.serverAddNewPlayerToLobby = function serverAddNewPlayerToLobby(name) {
	return {
		type: SERVER_ADD_NEW_PLAYER_TO_LOBBY,
		payload: name
	};
};

var SERVER_UPDATE_INVISIBLE_MODE = exports.SERVER_UPDATE_INVISIBLE_MODE = 'SERVER_UPDATE_INVISIBLE_MODE';

var serverUpdateInvisibleMode = exports.serverUpdateInvisibleMode = function serverUpdateInvisibleMode(isInvisibleMode) {
	return {
		type: SERVER_UPDATE_INVISIBLE_MODE,
		payload: isInvisibleMode
	};
};

var SERVER_UPDATE_REQUEST_URL = exports.SERVER_UPDATE_REQUEST_URL = 'SERVER_UPDATE_REQUEST_URL';
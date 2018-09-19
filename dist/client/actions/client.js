'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var UPDATE_HOST_LIST = exports.UPDATE_HOST_LIST = 'UPDATE_HOST_LIST';

var updateHostList = exports.updateHostList = function updateHostList(hostList) {
	return {
		type: UPDATE_HOST_LIST,
		hostList: hostList
	};
};

var UPDATE_PLAYER_NAME = exports.UPDATE_PLAYER_NAME = 'UPDATE_PLAYER_NAME';

var updatePlayerName = exports.updatePlayerName = function updatePlayerName(playerName) {
	return {
		type: UPDATE_PLAYER_NAME,
		playerName: playerName
	};
};

var UPDATE_SELECTED_GAME = exports.UPDATE_SELECTED_GAME = 'UPDATE_SELECTED_GAME';

var updateSelectedGame = exports.updateSelectedGame = function updateSelectedGame(hostID) {
	return {
		type: UPDATE_SELECTED_GAME,
		hostID: hostID
	};
};

var UPDATE_GAME_JOINED = exports.UPDATE_GAME_JOINED = 'UPDATE_GAME_JOINED';

var updateGameJoined = exports.updateGameJoined = function updateGameJoined(action) {
	return {
		type: UPDATE_GAME_JOINED,
		gameJoined: action.gameJoined,
		gameID: action.gameID
	};
};

var UPDATE_GAME_STATE = exports.UPDATE_GAME_STATE = 'UPDATE_GAME_STATE';

var updateGameState = exports.updateGameState = function updateGameState(gameState) {
	return {
		type: UPDATE_GAME_STATE,
		gameState: gameState
	};
};

var UPDATE_SHADOW_STATE = exports.UPDATE_SHADOW_STATE = 'UPDATE_SHADOW_STATE';

var updateShadowState = exports.updateShadowState = function updateShadowState(shadowCellsData) {
	return {
		type: UPDATE_SHADOW_STATE,
		shadowCellsData: shadowCellsData
	};
};

var UPDATE_HOST_STATUS = exports.UPDATE_HOST_STATUS = 'UPDATE_HOST_STATUS';

var updateHostStatus = exports.updateHostStatus = function updateHostStatus(isHost) {
	return {
		type: UPDATE_HOST_STATUS,
		isHost: isHost
	};
};

var UPDATE_PLAYER_UUID = exports.UPDATE_PLAYER_UUID = 'UPDATE_PLAYER_UUID';

var updatePlayerUUID = exports.updatePlayerUUID = function updatePlayerUUID(playerUUID) {

	return {
		type: UPDATE_PLAYER_UUID,
		playerUUID: playerUUID
	};
};

var UPDATE_ERROR = exports.UPDATE_ERROR = 'UPDATE_ERROR';

var updateError = exports.updateError = function updateError(errorMessage) {

	return {
		type: UPDATE_ERROR,
		errorMessage: errorMessage
	};
};

var RESET_STATE = exports.RESET_STATE = 'RESET_STATE';

var resetState = exports.resetState = function resetState(newState) {

	return {
		type: RESET_STATE,
		newState: newState
	};
};

var UPDATE_GAME_START = exports.UPDATE_GAME_START = 'UPDATE_GAME_START';

var updateGameStart = exports.updateGameStart = function updateGameStart() {
	return {
		type: UPDATE_GAME_START
	};
};

var IS_WINNER = exports.IS_WINNER = 'IS_WINNER';

var isWinner = exports.isWinner = function isWinner() {

	return {
		type: IS_WINNER
	};
};

var END_GAME = exports.END_GAME = 'END_GAME';

var endGame = exports.endGame = function endGame(playersLostList) {
	return {
		type: END_GAME,
		playersLostList: playersLostList
	};
};

var UPDATE_LEADER_BOARD = exports.UPDATE_LEADER_BOARD = 'UPDATE_LEADER_BOARD';

var updateLeaderBoard = exports.updateLeaderBoard = function updateLeaderBoard(leaderBoard) {
	return {
		type: UPDATE_LEADER_BOARD,
		leaderBoard: leaderBoard
	};
};

var UPDATE_INVISIBLE_MODE = exports.UPDATE_INVISIBLE_MODE = 'UPDATE_INVISIBLE_MODE';

var updateInvisibleMode = exports.updateInvisibleMode = function updateInvisibleMode(invisibleMode) {
	return {
		type: UPDATE_INVISIBLE_MODE,
		invisibleMode: invisibleMode
	};
};

var TOGGLE_INSTRUCTIONS = exports.TOGGLE_INSTRUCTIONS = 'TOGGLE_INSTRUCTIONS';

var toggleInstructions = exports.toggleInstructions = function toggleInstructions() {
	return {
		type: TOGGLE_INSTRUCTIONS
	};
};
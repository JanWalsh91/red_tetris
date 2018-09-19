'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _client = require('../actions/client');

var ClientActions = _interopRequireWildcard(_client);

var _initialState = require('../initialState');

var _initialState2 = _interopRequireDefault(_initialState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var updateHostList = function updateHostList(state, action) {
	return _extends({}, state, {
		hostList: action.hostList
	});
};

var updatePlayerName = function updatePlayerName(state, action) {
	if (action.playerName) {
		return _extends({}, state, {
			playerName: action.playerName
		});
	}
};

var updateSelectedGame = function updateSelectedGame(state, action) {
	return _extends({}, state, {
		gameSelected: action.hostID == state.gameSelected ? null : action.hostID
	});
};

var updateGameJoined = function updateGameJoined(state, action) {
	return _extends({}, state, {
		gameJoined: action.gameJoined,
		gameID: action.gameID
	});
};

var updateGameState = function updateGameState(state, action) {
	var gameState = _extends({}, state.gameState, action.gameState);

	return _extends({}, state, {
		gameState: gameState
	});
};

var updateShadowState = function updateShadowState(state, action) {
	var newShadowState = undefined;

	if (state.shadowState == undefined) {
		newShadowState = new Map();
	} else {
		newShadowState = new Map(state.shadowState);
	}

	if (action.shadowCellsData.update) {
		newShadowState.set(action.shadowCellsData.id, action.shadowCellsData);
	} else {
		newShadowState.delete(action.shadowCellsData.id);
	}
	return _extends({}, state, {
		shadowState: newShadowState
	});
};

var updateHostStatus = function updateHostStatus(state, action) {
	return _extends({}, state, {
		isHost: action.isHost
	});
};

var updatePlayerUUID = function updatePlayerUUID(state, action) {
	return _extends({}, state, {
		playerUUID: action.playerUUID
	});
};

var updateError = function updateError(state, action) {
	if (state.errorMessage == "500") {
		var _resetState = _extends({}, _initialState2.default, {
			hostList: [].concat(_toConsumableArray(_initialState2.default.hostList)),
			gameState: _extends({}, _initialState2.default.gameState)
		});

		return _extends({}, _resetState, {
			errorMessage: action.errorMessage
		});
	}
	return _extends({}, state, {
		errorMessage: action.errorMessage

	});
};

var resetState = function resetState(state, action) {
	var resetState = _extends({}, _initialState2.default, {
		hostList: [].concat(_toConsumableArray(_initialState2.default.hostList)),
		gameState: _extends({}, _initialState2.default.gameState)
	}, action.newState);
	return _extends({}, resetState);
};

var updateGameStart = function updateGameStart(state) {
	return _extends({}, state, {
		gameStart: true,
		endGame: false
	});
};

var isWinner = function isWinner(state) {
	return _extends({}, state, {
		isWinner: true
	});
};

var endGame = function endGame(state, action) {
	return _extends({}, state, {
		endGame: true,
		gameStart: false,
		playersLostList: action.playersLostList
	});
};

var updateLeaderBoard = function updateLeaderBoard(state, action) {
	return _extends({}, state, {
		leaderBoard: action.leaderBoard
	});
};

var updateInvisibleMode = function updateInvisibleMode(state, action) {
	return _extends({}, state, {
		invisibleMode: action.invisibleMode
	});
};

var toggleInstructions = function toggleInstructions(state) {
	return _extends({}, state, {
		showInstructions: !state.showInstructions
	});
};

var reducer = function reducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case ClientActions.UPDATE_HOST_LIST:
			return updateHostList(state, action);
		case ClientActions.UPDATE_PLAYER_NAME:
			return updatePlayerName(state, action);
		case ClientActions.UPDATE_SELECTED_GAME:
			return updateSelectedGame(state, action);
		case ClientActions.UPDATE_GAME_JOINED:
			return updateGameJoined(state, action);
		case ClientActions.UPDATE_GAME_STATE:
			return updateGameState(state, action);
		case ClientActions.UPDATE_SHADOW_STATE:
			return updateShadowState(state, action);
		case ClientActions.UPDATE_HOST_STATUS:
			return updateHostStatus(state, action);
		case ClientActions.UPDATE_PLAYER_UUID:
			return updatePlayerUUID(state, action);
		case ClientActions.UPDATE_ERROR:
			return updateError(state, action);
		case ClientActions.RESET_STATE:
			return resetState(state, action);
		case ClientActions.UPDATE_GAME_START:
			return updateGameStart(state);
		case ClientActions.IS_WINNER:
			return isWinner(state);
		case ClientActions.END_GAME:
			return endGame(state, action);
		case ClientActions.UPDATE_LEADER_BOARD:
			return updateLeaderBoard(state, action);
		case ClientActions.UPDATE_INVISIBLE_MODE:
			return updateInvisibleMode(state, action);
		case ClientActions.TOGGLE_INSTRUCTIONS:
			return toggleInstructions(state);
		default:
			return state;
	}
};

exports.default = reducer;
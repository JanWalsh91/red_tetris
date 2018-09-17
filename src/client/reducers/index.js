import { UPDATE_HOST_LIST, UPDATE_PLAYER_NAME, UPDATE_SELECTED_GAME, UPDATE_GAME_JOINED, UPDATE_GAME_STATE, UPDATE_SHADOW_STATE, UPDATE_HOST_STATUS, UPDATE_PLAYER_UUID, UPDATE_ERROR, RESET_STATE, UPDATE_GAME_START, IS_WINNER, IS_WINNER_BY_SCORE, END_GAME, UPDATE_LEADER_BOARD, UPDATE_INVISIBLE_MODE, TOGGLE_INSTRUCTIONS} from '../actions/client'

import * as ActionNames from '../../server/serverActions'
import initialState from '../initialState'

const updateHostList = (state, action) => {
	return {
		...state,
		hostList: action.hostList
	};
}

const updatePlayerName = (state, action) => {
	if (action.playerName) {
		return {
			...state,
			playerName: action.playerName
		};
	}
}

const updateSelectedGame = (state, action) => {
	return {
		...state,
		gameSelected: action.hostID == state.gameSelected ? null : action.hostID
	}
}

const updateGameJoined = (state, action) => {
	return {
		...state,
		gameJoined: action.gameJoined,
		gameID: action.gameID
	}
}

const updateGameState = (state, action) => {
	let gameState = {
		...state.gameState,
		...action.gameState
	};

	return {
		...state,
		gameState: gameState
	}
}

const updateShadowState = (state, action) => {
	let newShadowState = undefined;

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
	return {
		...state,
		shadowState: newShadowState
	}
}

const updateHostStatus = (state, action) => {
	return {
		...state,
		isHost: action.isHost
	}
}

const updatePlayerUUID = (state, action) => {
	return {
		...state,
		playerUUID: action.playerUUID
	}
}

const updateError = (state, action) => {
	if (state.errorMessage == "500") {
		let resetState = {
			...initialState,
			hostList: [...initialState.hostList],
			gameState: {...initialState.gameState}
		}

		return {
			...resetState,
			errorMessage: action.errorMessage
		}
	}
	return {
		...state,
		errorMessage: action.errorMessage

	}
}

const resetState = (state, action) => {
	let resetState = {
		...initialState,
		hostList: [...initialState.hostList],
		gameState: {...initialState.gameState},
		...action.newState
	}
	return {
		...resetState
	}
}

const updateGameStart = state => {
	return {
		...state,
		gameStart: true,
		endGame: false
	}
}

const isWinner = state => {
	return {
		...state,
		isWinner: true
	}
}

const isWinnerByScore = state => {
	return {
		...state,
		isWinnerByScore: true
	}
}

const endGame = (state, action) => {
	return {
		...state,
		endGame: true,
		gameStart: false,
		playersLostList: action.playersLostList
	}
}

const updateLeaderBoard = (state, action) => {
	return {
		...state,
		leaderBoard: action.leaderBoard
	}
}

const updateInvisibleMode = (state, action) => {
	return {
		...state,
		invisibleMode: action.invisibleMode
	}
}

const toggleInstructions = (state) => {
	return {
		...state,
		showInstructions: !state.showInstructions
	}
}

const reducer = (state = {} , action) => {
	console.log("reducer action type: ", action.type);
	switch(action.type) {
		case UPDATE_HOST_LIST: return updateHostList(state, action);
		case UPDATE_PLAYER_NAME: return updatePlayerName(state, action);
		case UPDATE_SELECTED_GAME: return updateSelectedGame(state, action);
		case UPDATE_GAME_JOINED: return updateGameJoined(state, action);
		case UPDATE_GAME_STATE: return updateGameState(state, action);
		case UPDATE_SHADOW_STATE: return updateShadowState(state, action);
		case UPDATE_HOST_STATUS: return updateHostStatus(state, action);
		case UPDATE_PLAYER_UUID: return updatePlayerUUID(state, action);
		case UPDATE_ERROR: return updateError(state, action);
		case RESET_STATE: return resetState(state, action);
		case UPDATE_GAME_START: return updateGameStart(state);
		case IS_WINNER: return isWinner(state);
		case IS_WINNER_BY_SCORE: return isWinnerByScore(state);
		case END_GAME: return endGame(state, action);
		case UPDATE_LEADER_BOARD: return updateLeaderBoard(state, action);
		case UPDATE_INVISIBLE_MODE: return updateInvisibleMode(state, action);
		case TOGGLE_INSTRUCTIONS: return toggleInstructions(state);
		default: console.log('default'); return state;
	}
}

export default reducer

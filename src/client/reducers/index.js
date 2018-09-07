import { ALERT_POP, UPDATE_HOST_LIST, UPDATE_PLAYER_NAME, UPDATE_SELECTED_GAME, UPDATE_GAME_JOINED, UPDATE_GAME_STATE } from '../actions/client'
import { PING_SERVER } from '../actions/server'

import socket from '../socket'

import * as ActionNames from '../../server/serverActions'

// import io from 'socket-io'

const alertPop = (state, action) => {
	console.log("ALERT_POP dispatched");
	return {
		...state,
		message: action.message
	}
}

const pingServer = (state, action) => {
	console.log("pingServer reducer");

	socket.emit('action', {type: 'server/ping'});

	return dispatch => {
		setTimeout(() => {
			// Yay! Can invoke sync or async actions with `dispatch`
			console.log("Ici apres 5s");
			dispatch(alertPop("Je"));
		}, 1000);
	};
}

const updateHostList = (state, action) => {
	console.log("updateHostList reducer");

	return {
		...state,
		hostList: action.hostList
	};
}

const updatePlayerName = (state, action) => {
	let name = document.getElementById('playerInputName').value;
	console.log("PlayerName: ", name);

	if (name != undefined && name.length > 0) {
		console.log("Emit new player");
		socket.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, name);
	}
	else {
		//Error
	}

	return {
		...state,
		playerName: name
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
		gameJoined: action.gameJoined
	}
}

const updateGameState = (state, action) => {
	return {
		...state,
		gameState: action.cells
	}
}

const reducer = (state = {} , action) => {
	console.log("reducer action type: ", action.type);
	switch(action.type) {
		case ALERT_POP: return alertPop(state, action);
		case PING_SERVER: return pingServer(state, action);
		case UPDATE_HOST_LIST: return updateHostList(state, action);
		case UPDATE_PLAYER_NAME: return updatePlayerName(state, action);
		case UPDATE_SELECTED_GAME: return updateSelectedGame(state, action);
		case UPDATE_GAME_JOINED: return updateGameJoined(state, action);
		case UPDATE_GAME_STATE: return updateGameState(state, action);
		default: console.log('default'); return state;
	}
}

export default reducer

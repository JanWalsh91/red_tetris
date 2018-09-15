import io from 'socket.io-client'
import params from '../../params'

import store from './store'
import {updateHostList, updateGameJoined, updateGameState, updateShadowState, updateHostStatus, updatePlayerUUID, updateError, updatePlayerName, resetState, updateGameStart, isWinner, isWinnerByScore, endGame, updateLeaderBoard} from './actions/client'

import * as ActionNames from '../server/serverActions'

const socket = io.connect(params.server.getUrl())

//TODO: to remove
window.sio = socket;

socket.on(ActionNames.UPDATE_HOST_LIST, (hostList) => {
	store.dispatch(updateHostList(hostList));
})

socket.on(ActionNames.UPDATE_GAME_JOINED, (action) => {
	// console.log("[socket.js] UPDATE_GAME_JOINED: ", action);
	updateHash(store.getState().playerName, action.gameID);
	store.dispatch(updateGameJoined(action));
})

socket.on(ActionNames.UPDATE_GAME_START, () => {
	store.dispatch(updateGameStart());
})

socket.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
	store.dispatch(updateGameState(gameState));
})

socket.on(ActionNames.UPDATE_SHADOW_STATE, (shadowCellsData) => {
	store.dispatch(updateShadowState(shadowCellsData))
})

socket.on(ActionNames.UPDATE_HOST_STATUS, (isHost) => {
	store.dispatch(updateHostStatus(isHost));
})

socket.on(ActionNames.UPDATE_PLAYER_UUID, (playerUUID) => {
	store.dispatch(updatePlayerUUID(playerUUID));
})

socket.on(ActionNames.UPDATE_PLAYER_NAME, (playerName) => {
	store.dispatch(updatePlayerName(playerName));
})

socket.on(ActionNames.IS_WINNER, () => {
	store.dispatch(isWinner());
})

socket.on(ActionNames.IS_WINNER_BY_SCORE, () => {
	store.dispatch(isWinnerByScore());
})

socket.on(ActionNames.END_GAME, () => {

	console.log("SOCKET END GAME");
	store.dispatch(endGame());
})


socket.on("connect", () => {
	readHash();
	store.dispatch(updateError(null));
})

socket.on("disconnect", () => {
	updateHash();
	store.dispatch(updateError("500"));
})

socket.on(ActionNames.UPDATE_LEADER_BOARD, (leaderBoard) => {
	store.dispatch(updateLeaderBoard(leaderBoard));
})


const readHash = () => {
	console.log("[socket.js] readHash");
	let regexPlayerRoom = /#(\d+)\[(.+)\]/;
	let url = window.location.hash;

	let match = regexPlayerRoom.exec(url);
	console.log(match);
	if (!!match) {
		let gameID = match[1];
		let playerName = match[2];
		if (gameID == store.getState().gameID && playerName == store.getState().playerName) return ;
		console.log("UPDATE_REQUEST_URL", {gameID, playerName});
		store.dispatch(resetState());
		socket.emit(ActionNames.UPDATE_REQUEST_URL, {gameID, playerName});
	}
}

const updateHash = (playerName, gameID) => {
	console.log("UpdateHash");
	if (!playerName || !gameID) {
		window.location.href = '/';
	} else {
		window.location.hash = `${gameID}[${playerName}]`;
	}
}

socket.on(ActionNames.SEND_ERROR_STATUS, (errorMessage) => {
	store.dispatch(updateError(errorMessage));
})


window.onhashchange = readHash;

export default socket

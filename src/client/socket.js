import io from 'socket.io-client'
import params from '../../params'

import store from './store'
import {updateHostList, updateGameJoined, updateGameState, updateShadowState, updateHostStatus, updatePlayerUUID, updateError, updatePlayerName, resetState, updateGameStart, isWinner, isWinnerByScore, endGame, updateLeaderBoard} from './actions/client'

import * as ActionNames from '../server/serverActions'
const socket = io.connect(params.server.getUrl())

socket.on(ActionNames.UPDATE_HOST_LIST, (hostList) => {
	store.dispatch(updateHostList(hostList));
})

socket.on(ActionNames.UPDATE_GAME_JOINED, (action) => {
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

socket.on(ActionNames.END_GAME, (playersLostList) => {
	store.dispatch(endGame(playersLostList));
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

socket.on(ActionNames.SEND_ERROR_STATUS, (errorMessage) => {
	store.dispatch(updateError(errorMessage));
})

const readHash = () => {
	let regexPlayerRoom = /#(\d+)\[(.+)\]/;
	let url = window.location.hash;

	let match = regexPlayerRoom.exec(url);
	if (!!match) {
		let gameID = match[1];
		let playerName = match[2];
		if (gameID == store.getState().gameID && playerName == store.getState().playerName) return ;
		store.dispatch(resetState());
		socket.emit(ActionNames.UPDATE_REQUEST_URL, {gameID, playerName: decodeURIComponent(playerName)});
	}
}

const updateHash = (playerName, gameID) => {
	if (!playerName || !gameID) {
		try {
			window.location.href = '/';
		} catch(e) {
			console.log("href assign error");
		}
	} else {
		try {
			window.location.hash = `${gameID}[${playerName}]`;
		} catch(e) {
			console.log("href assign error");
		}
	}
}

window.onhashchange = readHash;

export default socket

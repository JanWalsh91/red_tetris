import io from 'socket.io-client'
import params from '../../params'

import store from './index'
import {updateHostList, updateGameJoined, updateGameState, updateShadowState, updateHostStatus, updatePlayerUUID, updateError, updatePlayerName, resetState} from './actions/client'

import * as ActionNames from '../server/serverActions'

const socket = io.connect(params.server.getUrl())

socket.on(ActionNames.UPDATE_HOST_LIST, (hostList) => {
	store.dispatch(updateHostList(hostList));
})

socket.on(ActionNames.UPDATE_GAME_JOINED, (joined) => {
	store.dispatch(updateGameJoined(joined));
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

socket.on("connect", () => {
	readHash();
	store.dispatch(updateError(null));
})

socket.on("disconnect", () => {
	store.dispatch(updateError("500"));
})

setTimeout(() => {
	console.log("store: ",  store);
}, 9000);

const readHash = () => {
	let regexPlayerRoom = /#(\d+)\[(.+)\]/;
	let url = window.location.hash;

	let match = regexPlayerRoom.exec(url);
	if (match) {
		let gameID = match[1];
		let playerName = match[2];
		console.log("playerName: ", playerName, "gameID: ", gameID);

		store.dispatch(resetState());
		socket.emit(ActionNames.UPDATE_REQUEST_URL, {gameID, playerName});
	}
}

socket.on(ActionNames.SEND_ERROR_STATUS, (errorMessage) => {
	store.dispatch(updateError(errorMessage));
})




window.onhashchange = readHash;

module.exports = socket;

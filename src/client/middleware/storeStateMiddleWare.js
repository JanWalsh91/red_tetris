import * as ActionNames from '../../server/serverActions'
import { SERVER_UPDATE_REQUEST_URL } from '../actions/server'

import {updateHostList, updateGameJoined, updateGameState, updateShadowState, updateHostStatus, updatePlayerUUID, updateError, updatePlayerName, resetState, updateGameStart, isWinner, isWinnerByScore, endGame, updateLeaderBoard} from '../actions/client'

export const storeStateMiddleWare = socket => ({ dispatch, getState }) => {
	// set socket.io listeners and dispatch
	socket.on(ActionNames.UPDATE_HOST_LIST, (hostList) => {
		dispatch(updateHostList(hostList));
	})

	socket.on(ActionNames.UPDATE_GAME_JOINED, (action) => {
		updateHash(getState().playerName, action.gameID);
		dispatch(updateGameJoined(action));
	})

	socket.on(ActionNames.UPDATE_GAME_START, () => {
		dispatch(updateGameStart());
	})

	socket.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
		dispatch(updateGameState(gameState));
	})

	socket.on(ActionNames.UPDATE_SHADOW_STATE, (shadowCellsData) => {
		dispatch(updateShadowState(shadowCellsData))
	})

	socket.on(ActionNames.UPDATE_HOST_STATUS, (isHost) => {
		dispatch(updateHostStatus(isHost));
	})

	socket.on(ActionNames.UPDATE_PLAYER_UUID, (playerUUID) => {
		dispatch(updatePlayerUUID(playerUUID));
	})

	socket.on(ActionNames.UPDATE_PLAYER_NAME, (playerName) => {
		dispatch(updatePlayerName(playerName));
	})

	socket.on(ActionNames.IS_WINNER, () => {
		dispatch(isWinner());
	})

	socket.on(ActionNames.END_GAME, (playersLostList) => {
		dispatch(endGame(playersLostList));
	})

	socket.on("connect", () => {
		readHash();
		dispatch(updateError(null));
	})

	socket.on("disconnect", () => {
		updateHash();
		dispatch(updateError("500"));
	})

	socket.on(ActionNames.UPDATE_LEADER_BOARD, (leaderBoard) => {
		dispatch(updateLeaderBoard(leaderBoard));
	})

	socket.on(ActionNames.SEND_ERROR_STATUS, (errorMessage) => {
		dispatch(updateError(errorMessage));
	})

	const readHash = () => {
		let regexPlayerRoom = /#(\d+)\[(.+)\]/;
		let url = window.location.hash;

		let match = regexPlayerRoom.exec(url);
		if (!!match) {
			let gameID = match[1];
			let playerName = match[2];
			if (gameID == getState().gameID && playerName == getState().playerName) return ;
			dispatch(resetState());
			socket.emit(SERVER_UPDATE_REQUEST_URL, {gameID, playerName: decodeURIComponent(playerName)});
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

	return (next) => (action) => {
		// handle server emit actions
		if(socket) {
			if (action.type.includes("SERVER")) {
				socket.emit(action.type, action.payload);
			}
		}
		return next(action)
	}
}

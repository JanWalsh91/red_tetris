export const UPDATE_HOST_LIST = 'UPDATE_HOST_LIST'

export const updateHostList = ( hostList ) => {
	console.log("updateHostList");
	return {
		type: UPDATE_HOST_LIST,
		hostList
	}
}

export const UPDATE_PLAYER_NAME = 'UPDATE_PLAYER_NAME'

export const updatePlayerName = (playerName) => {
	return {
		type: UPDATE_PLAYER_NAME,
		playerName
	}
}

export const UPDATE_SELECTED_GAME = 'UPDATE_SELECTED_GAME'

export const updateSelectedGame = (hostID) => {
	return {
		type: UPDATE_SELECTED_GAME,
		hostID
	}
}

export const UPDATE_GAME_JOINED = 'UPDATE_GAME_JOINED'

export const updateGameJoined = (action) => {

	console.log("[client.js] updateGameJoined: ", action);

	return {
		type: UPDATE_GAME_JOINED,
		gameJoined: action.gameJoined,
		gameID: action.gameID
	}
}

export const UPDATE_GAME_STATE = 'UPDATE_GAME_STATE'

export const updateGameState = (gameState) => {

	console.log("updateGameState");

	return {
		type: UPDATE_GAME_STATE,
		gameState
	}
}

export const UPDATE_SHADOW_STATE = 'UPDATE_SHADOW_STATE'

export const updateShadowState = (shadowCellsData) => {

	console.log("updateShadowState");

	return {
		type: UPDATE_SHADOW_STATE,
		shadowCellsData
	}
}

export const UPDATE_HOST_STATUS = 'UPDATE_HOST_STATUS'

export const updateHostStatus = (isHost) => {

	console.log("updateHostStatus");

	return {
		type: UPDATE_HOST_STATUS,
		isHost
	}
}

export const UPDATE_PLAYER_UUID = 'UPDATE_PLAYER_UUID'

export const updatePlayerUUID = (playerUUID) => {

	return {
		type: UPDATE_PLAYER_UUID,
		playerUUID
	}
}

export const UPDATE_ERROR = 'UPDATE_ERROR'

export const updateError = (errorMessage) => {

	return {
		type: UPDATE_ERROR,
		errorMessage
	}
}

export const RESET_STATE = 'RESET_STATE'

export const resetState = (newState) => {

	return {
		type: RESET_STATE,
		newState
	}
}

export const UPDATE_GAME_START = 'UPDATE_GAME_START'

export const updateGameStart = () => {
	return {
		type: UPDATE_GAME_START
	}
}

export const IS_WINNER = 'IS_WINNER'

export const isWinner = () => {

	return {
		type: IS_WINNER
	}
}

export const IS_WINNER_BY_SCORE = 'IS_WINNER_BY_SCORE'

export const isWinnerByScore = () => {
	return {
		type: IS_WINNER_BY_SCORE
	}
}

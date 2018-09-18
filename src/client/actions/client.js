export const UPDATE_HOST_LIST = 'UPDATE_HOST_LIST'

export const updateHostList = ( hostList ) => {
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
	return {
		type: UPDATE_GAME_JOINED,
		gameJoined: action.gameJoined,
		gameID: action.gameID
	}
}

export const UPDATE_GAME_STATE = 'UPDATE_GAME_STATE'

export const updateGameState = (gameState) => {
	return {
		type: UPDATE_GAME_STATE,
		gameState
	}
}

export const UPDATE_SHADOW_STATE = 'UPDATE_SHADOW_STATE'

export const updateShadowState = (shadowCellsData) => {
	return {
		type: UPDATE_SHADOW_STATE,
		shadowCellsData
	}
}

export const UPDATE_HOST_STATUS = 'UPDATE_HOST_STATUS'

export const updateHostStatus = (isHost) => {
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

export const END_GAME = 'END_GAME'

export const endGame = (playersLostList) => {
	return {
		type: END_GAME,
		playersLostList
	}
}

export const UPDATE_LEADER_BOARD = 'UPDATE_LEADER_BOARD'

export const updateLeaderBoard = (leaderBoard) => {
	return {
		type: UPDATE_LEADER_BOARD,
		leaderBoard
	}
}

export const UPDATE_INVISIBLE_MODE = 'UPDATE_INVISIBLE_MODE'

export const updateInvisibleMode = (invisibleMode) => {
	return {
		type: UPDATE_INVISIBLE_MODE,
		invisibleMode
	}
}

export const TOGGLE_INSTRUCTIONS = 'TOGGLE_INSTRUCTIONS'

export const toggleInstructions = (invisibleMode) => {
	return {
		type: TOGGLE_INSTRUCTIONS
	}
}

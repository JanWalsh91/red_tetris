export const SERVER_CREATE_GAME = 'SERVER_CREATE_GAME'

export const serverCreateGame = () => {
	return {
		type: SERVER_CREATE_GAME
	}
}

export const SERVER_JOIN_GAME = 'SERVER_JOIN_GAME'

export const serverJoinGame = (gameSelected) => {
	return {
		type: SERVER_JOIN_GAME,
		payload: gameSelected
	}
}

export const SERVER_GAME_ACTION = 'SERVER_GAME_ACTION'

export const serverGameAction = (gameAction) => {
	return {
		type: SERVER_GAME_ACTION,
		payload: gameAction
	}
}

export const SERVER_START_GAME = 'SERVER_START_GAME'

export const serverStartGame = () => {
	return {
		type: SERVER_START_GAME
	}
}

export const SERVER_QUIT_GAME = 'SERVER_QUIT_GAME'

export const serverQuitGame = () => {
	return {
		type: SERVER_QUIT_GAME
	}
}

export const SERVER_ADD_NEW_PLAYER_TO_LOBBY = 'SERVER_ADD_NEW_PLAYER_TO_LOBBY'

export const serverAddNewPlayerToLobby = (name) => {
	return {
		type: SERVER_ADD_NEW_PLAYER_TO_LOBBY,
		payload: name
	}
}

export const SERVER_UPDATE_INVISIBLE_MODE = 'SERVER_UPDATE_INVISIBLE_MODE'

export const serverUpdateInvisibleMode = (isInvisibleMode) => {
	return {
		type: SERVER_UPDATE_INVISIBLE_MODE,
		payload: isInvisibleMode
	}
}

export const SERVER_UPDATE_REQUEST_URL = 'SERVER_UPDATE_REQUEST_URL'

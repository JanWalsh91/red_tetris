export const ALERT_POP = 'ALERT_POP'

export const alert = (message) => {
	console.log("creating alert");
	return {
		type: ALERT_POP,
		message
	}
}

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

export const updateGameJoined = (gameJoined) => {
	return {
		type: UPDATE_GAME_JOINED,
		gameJoined
	}
}

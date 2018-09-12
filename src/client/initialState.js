const initialState = {
	hostList: [],
	playerName: '',
	gameSelected: null, // Null / #
	gameJoined: false, // True / False
	gameID: null,
	isHost: false,
	gameState: {
		score: 0,
		level: 0,
		cells: undefined,
		nextPieces: undefined,
		removedLines: 0
	}
}

export default initialState

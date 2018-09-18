const initialState = {
	hostList: [],
	playerName: '',
	gameSelected: null,
	gameJoined: false,
	gameID: null,
	isHost: false,
	endGame: false,
	isWinner: false,
	isWinnerByScore: false,
	gameState: {
		score: 0,
		level: 0,
		cells: undefined,
		nextPieces: undefined,
		removedLines: 0,
		savedPiece: null
	},
	showInstructions: false,
	playersLostList: []
}

export default initialState

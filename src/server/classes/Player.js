class Player {
	constructor(name, socketID, socket) {
		this.name = name;
		this.socketID = socketID;
		this.socket = socket;
		this.board = null;
	}
}

export default Player

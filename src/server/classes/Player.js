import uuidv4 from 'uuid/v4'

class Player {


	constructor(name, socketID) {
		this.name = name;
		this.socketID = socketID;
		this.uuid = uuidv4();
		this.board = null;
	}
}



export default Player

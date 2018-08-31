class Game {
	static gameCount = 0;
	static maxPlayers = 4;

	constructor(player) {
		this.id = Game.gameCount++;
		this.host = player;
		this.isPlaying = false;
		this.players = [player];
	}

	getInfo() {
		return {
			id: this.id,
			hostName: this.host.name,
			playerCount: this.players.length
		};
	}
}

export default Game

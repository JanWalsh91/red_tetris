class Game {
	static gameCount = 0;

	constructor(player) {
		this.host = player;
		this.id = ++Game.gameCount;
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

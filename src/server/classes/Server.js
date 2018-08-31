import Game from './Game'
import Player from './Player'

class Server {

	// games[0].getPlayers
	constructor() {
		this.games = []
		this.pendingPlayers = new Map();

		this.games.push(
			new Game(
				new Player('toetoe', 1)
			)
		)
		this.games.push(
			new Game(
				new Player('barf', 2)
			)
		)
		this.games.push(
			new Game(
				new Player('foofoo', 3)
			)
		)
	}

	// Events Methods

	// on open connection
		// save the uuid
		// get nb rooms (states)


	getJoinableGames() {
		console.log("getJoinableGames");
		let joinableGames = [];

		this.games.forEach( game => {
			// console.log("foreach: ");
			// console.dir(game);
			if (!game.isPlaying && game.players.length < Game.maxPlayers) {
				joinableGames.push(game.getInfo())
			}
		});
		return joinableGames;
	}

	removePlayerFromGame(player, game) {
		// console.log("removePlayerFromGame");
		// console.dir(game);
		// console.dir(player);
		if (this.playerIsInGame(player, game.id)) {
			// console.log("removing player from game");
			game.players = game.players.filter( p => {
				let a = (p.socketID != player.socketID)
				if (a === false)
					console.log("removing player ", player.socketID, " from game ", game.id);
				return a;
			});
			// remove games if there are no players
			// console.log("game.players.length: ", game.players.length);
			if (game.players.length == 0) {
				console.log("filtering out empty games");
				this.games = this.games.filter( g => {
					let a = (g.id != game.id);
					if (a === false)
						console.log("removing game: ", g.id);
					return a;
				} );
				console.dir(this.games);
			}
			// reassign if host removed
		}
	}

	getGameByID(gameID) {
		return this.games.find( g => g.id == gameID);
	}

	playerIsInGame(player, gameID) {
		// console.log(gameID);
		// console.dir(this.games);

		let g = this.getGameByID(gameID);

		let a = false;
		if (g)
			a = g.players.map((player) => player.socketID).includes(player.socketID);
		// console.log("playerIsInGame: ", a);
		return a;
	}

	onJoinGame(player, gameID) {
		console.log("onJoinGame");
		// console.dir(this.games)
		console.log("GameID: ", gameID);
		// if (!gameId) {
			// create new game with player as host
			// let game = new Game(player.id)
		// } else {
			// add player to game
			// this.games[gameID].players.push(player);
		// }

		let g = this.getGameByID(gameID);

		if (!g) {
			this.games.push(new Game(player));
		} else {
			if (!this.playerIsInGame(player, gameID)) {
				// remove player from other games
				// console.log
				this.games.forEach( game => this.removePlayerFromGame(player, game) );
				// console.log("Games after player removal: ", this.games);
				// add player to selected game
				g.players.push(player);
			}
		}

		// console.log("Number of player in the Game", gameID,": ", this.games[gameID].players.length);
	}

	onCreateNewGame(player) {
		// remove player from other games
		this.games.forEach( game => this.removePlayerFromGame(player, game) );
		this.games.push( new Game (player) );
	}

	// on select game,
		// add to game / create new game
		// update player info

	// on update game
		// update game info
		//


}

export default Server

// class Player {

	// socket id

// }
//

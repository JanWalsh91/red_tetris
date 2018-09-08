import Game from './Game'
import Player from './Player'

import * as ActionNames from './../serverActions'

class Server {

	static io = null;

	// games[0].getPlayers
	constructor() {
		this.games = []
		this.lobby = new Map();
		this.sockets = new Map();
		// this.games.push( new Game( new Player('toetoe', 1) ) );
	}

	// Events Methods

	// on open connection
		// save the uuid
		// get nb rooms (states)

	/*
	*	Emits an updated list of available games to all sockets joined to 'lobby'
	*/
	static updateHostList(joinableGames) {
		Server.io.to('lobby').emit(ActionNames.UPDATE_HOST_LIST, joinableGames);
	}

	/*
	*	For a player, send its gameState to him
	*/
	static updateGameState(player) {
		player.socket.emit(ActionNames.UPDATE_GAME_STATE, player.board.getCells());
	}

	/*
	*	Emits the shadowBoard of a player to the whole room
	*/
	static updateShadowBoard(gameID, player) {
		let shadowCellData = {
			id: player.socketID,
			name: player.name,
			board: player.board.getShadowCells()
		}
		Server.io.to(gameID).emit(ActionNames.UPDATE_SHADOW_STATE, shadowCellData);
	}

	getJoinableGames() {
		console.log("[Server.js] getJoinableGames");
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
		console.log("[Server.js] removePlayerFromGame");
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

		let game = this.getGameByID(gameID);

		let isInGame = false;
		if (game)
			isInGame = game.players.map((player) => player.socketID).includes(player.socketID);
		// console.log("playerIsInGame: ", a);
		return isInGame;
	}

	joinGame(player, gameID) {
		console.log("[Server.js] joinGame");
		// console.dir(this.games)
		console.log("GameID: ", gameID);

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

	createNewGame(player) {
		console.log("[Server.js] createNewGame");
		// remove player from other games
		this.games.forEach( game => this.removePlayerFromGame(player, game) );
		let game = new Game(player);
		this.games.push( game );
		game.init();
		return game;
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

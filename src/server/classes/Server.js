import Game from './Game'
import Player from './Player'

import * as ActionNames from './../serverActions'

class Server {

	constructor(io) {
		this.games = []
		// this.lobby = new Map();
		// this.sockets = new Map(); // { socket.id: game } (-> this.games)
		this.games = new Map();
		this.players = new Map();
		this.io = io;
	}

	/*
	*	Emits an updated list of available games to all sockets joined to 'lobby'
	*/
	updateHostList() {
		let joinableGames = new Map();
		for (var [socketID, game] of this.games) {
			if (game && !game.isPlaying && game.players.length < Game.maxPlayers) {
				console.log("check");
				joinableGames.set(game.id, game.getInfo());
			}
		}
		this.io.to('lobby').emit(ActionNames.UPDATE_HOST_LIST, [...joinableGames.values()]);
	}

	/*
	*	For a player, send its gameState to him
	*/
	updateGameState = (player) => {
		// console.log("[index.js] updateGameState");
		if (player.board.needToBroadcast) {
			this.updateShadowBoard(player);
			player.board.needToBroadcast = false;
		}
		let gameState = {
			cells: player.board.getCells(),
			score: player.score,
			level: this.games.get(player.socketID).level,
			nextPieces: [],
			lines: player.board.lines
		};

		this.io.to(player.socketID).emit(ActionNames.UPDATE_GAME_STATE, gameState);
	}

	updateHostStatus = (player) => {
		console.log("udpateHostStatus");
		let isHost = false;
		if (player.socketID == this.games.get(player.socketID).host.socketID) {
			isHost = true;
		}
		console.log("host ? ", isHost);
		this.io.to(player.socketID).emit(ActionNames.UPDATE_HOST_STATUS, isHost);
	}

	/*
	*	Emits the shadowBoard of a player to the whole room
	*/
	updateShadowBoard(player, update = true) {
		let gameID = this.games.get(player.socketID).id;
		let shadowCellData = {
			id: player.uuid,
			name: player.name,
			board: player.board.getShadowCells(),
			update
		}
		this.io.to(gameID).emit(ActionNames.UPDATE_SHADOW_STATE, shadowCellData);
	}

	getGameByID(gameID) {

		console.log(this.games);

		for (var [socketID, game] of this.games) {
  			if (game && game.id == gameID) {
				return game;
			}
		}
		return null;
	}

	udpatePlayerUUID(player) {
		this.io.to(player.socketID).emit(ActionNames.UPDATE_PLAYER_UUID, player.uuid);
	}

	// NEW functions

	addNewPlayerToLobby(socket, playerName) {
		this.players.set(socket.id, new Player(playerName, socket.id));
		this.games.set(socket.id, null);
		socket.join('lobby');
		this.udpatePlayerUUID(this.players.get(socket.id));
		this.updateHostList();
	}

	joinGame(socket, gameID) {
		let player = this.players.get(socket.id);
		let game = this.getGameByID(gameID);
		if (!game) return ;

		game.players.push(player);

		this.games.set(socket.id, game);
		socket.leave('lobby');
		socket.join(gameID);

		this.updateHostList();
		socket.emit(ActionNames.UPDATE_GAME_JOINED, true);

		game.initPlayerBoard(player);
		this.updateGameState(player);
	}

	createGame(socket) {
		let player = this.players.get(socket.id);

		let game = new Game(player);
		this.games.set(socket.id, game);
		game.init();

		socket.leave('lobby');
		socket.join(game.id);
		this.updateHostList();

		socket.emit(ActionNames.UPDATE_GAME_JOINED, true);
		game.initPlayerBoard(player);
		this.updateGameState(player);
		this.updateHostStatus(player);
	}

	startGame(socket) {

		let player = this.players.get(socket.id);
		let game = this.games.get(socket.id);

		if (game.host.socketID !== socket.id) return ;

		game.start();

		game.players.forEach( player => {
			player.board.setNextActivePiece();
			this.io.to(player.socketID).emit(ActionNames.UPDATE_GAME_STATE, player.board.getCells());
		});

		game.interval = setInterval(() => {
			game.players.forEach( player => {
				if (player.board.gameOver) return ;

				if (player.board.linesremoved) {
					game.players.forEach( player => {
						if (player.socketID != socket.id) {
							player.board.frozenLines++;
						}
					});
				}

				if (!player.board.moveDown()) {
					player.board.freezePiece(player.board.activePiece);
					player.board.removeFullLine();
					player.board.setNextActivePiece();

					this.updateShadowBoard(player);
				}
				this.io.to(player.socketID).emit(ActionNames.UPDATE_GAME_STATE, player.board.getCells());
				this.updateGameState(player);
			});

			if (game.players.every(player => player.board.gameOver)) {
				clearInterval(game.interval);
			}

		}, 1000);
		this.updateHostList();
	}

	playerAction(socket, action) {
		let player = this.players.get(socket.id);
		if (player.board.gameOver) return;
		let game = this.games.get(socket.id);

		switch (action) {
			case "downShortcut":
				player.board.downShortcut();
				this.updateGameState(player);
				break;
			case "left":
				player.board.moveLeft();
				this.updateGameState(player);
				break;
			case "right":
				player.board.moveRight();
				this.updateGameState(player);
				break;
			case "down":
				player.board.moveDown();
				this.updateGameState(player);
				break;
			case "rotate":
				player.board.rotate();
				this.updateGameState(player);
				break;
			default: break;
		}
	}

	playerDisconnect(socket) {
		let game = this.games.get(socket.id);
		let player = this.players.get(socket.id);

		if (player) {
			this.updateShadowBoard(player, false);
		}

		this.players.delete(socket.id);
		this.games.delete(socket.id);

		if (!game) return ;
		game.players = game.players.filter( player => player.socketID != socket.id);

		if (game.players.length == 0) {
			game.isPlaying = false;
			this.updateHostList();
			clearInterval(game.interval);
			return ;
		}
		if (game.host.socketID == socket.id) {
			game.host = game.players[0];
		}
	}
}

export default Server

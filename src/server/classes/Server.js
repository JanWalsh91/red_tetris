import Game from './Game'
import Player from './Player'
import AsyncLock from 'async-lock'
import fs from 'fs'

import * as ActionNames from './../serverActions'

class Server {

	constructor(io) {
		this.games = new Map();
		this.players = new Map();
		this.io = io;
		this.lock = new AsyncLock();
	}

	/*
	*	Emits an updated list of available games to all sockets joined to 'lobby'
	*/
	updateHostList() {
		let joinableGames = new Map();
		for (var [socketID, game] of this.games) {
			if (game && !game.isPlaying && game.players.length < Game.maxPlayers) {
				joinableGames.set(game.id, game.getInfo());
			}
		}
		this.io.to('lobby').emit(ActionNames.UPDATE_HOST_LIST, [...joinableGames.values()].sort((a, b) => {
			return a.id - b.id;
		}));
	}

	/*
	*	For a player, send its gameState to him
	*/
	updateGameState = (player) => {
		let gameState = {
			cells: player.board.getCells(),
		};

		if (player.board.savedPiece) {
			gameState.savedPiece = player.board.savedPiece;
		}

		if (player.board.needToBroadcast) {
			this.updateShadowBoard(player);
			gameState.score = player.score;
			gameState.level = this.games.get(player.socketID).level;
			gameState.nextPieces = this.getNextPieces(player);
			gameState.removedLines = player.board.removedLines;
			player.board.needToBroadcast = false;
		}

		this.io.to(player.socketID).emit(ActionNames.UPDATE_GAME_STATE, gameState);
	}

	getNextPieces (player) {
		return player.board.piecesList.slice(0, 3);
	}

	updateHostStatus = (player) => {
		let isHost = false;
		if (player.socketID == this.games.get(player.socketID).host.socketID) {
			isHost = true;
		}
		this.io.to(this.games.get(player.socketID).id).emit(ActionNames.UPDATE_HOST_STATUS, isHost);
	}

	/*
	*	Emits the shadowBoard of a player to the whole room
	*/
	updateShadowBoard(player, update = true) {
		let shadowCellData = {
			id: player.uuid,
			name: player.name,
			board: player.board.getShadowCells(),
			score: player.score,
			update
		}
		this.io.to(this.games.get(player.socketID).id).emit(ActionNames.UPDATE_SHADOW_STATE, shadowCellData);
	}

	getGameByID(gameID) {
		for (var [socketID, game] of this.games) {
  			if (game && game.id == gameID) {
				return game;
			}
		}
		return null;
	}

	updatePlayerUUID(player) {
		this.io.to(player.socketID).emit(ActionNames.UPDATE_PLAYER_UUID, player.uuid);
	}

	updatePlayerName(player) {
		this.io.to(player.socketID).emit(ActionNames.UPDATE_PLAYER_NAME, player.name);
	}


	sendBestScore(socket) {
		this.readBestScore((leaderBoard) => {
			this.io.to(socket.id).emit(ActionNames.UPDATE_LEADER_BOARD, leaderBoard);
		})
	}

	onURLJoin(socket, data) {
		const URLJoin = () => {
			this.lock.acquire("K", done => {
				this.players.set(socket.id, new Player(data.playerName, socket.id));

				let game = this.getGameByID(data.gameID);

				if (game && game.isPlaying) {
					this.io.to(socket.id).emit(ActionNames.SEND_ERROR_STATUS, "Can't join a game in progress");
				} else {
					this.updatePlayerUUID(this.players.get(socket.id));
					this.updatePlayerName(this.players.get(socket.id));
					if (game) {
						if (game.players.length > 3) {
							this.io.to(socket.id).emit(ActionNames.SEND_ERROR_STATUS, "Max players reached :/");
							done();
							return ;
						}
						this.joinGame(socket, game.id);
					} else {
						this.createGame(socket, data.gameID);
					}
					this.io.to(socket.id).emit(ActionNames.SEND_ERROR_STATUS, null);
				}
				done();
			});
		}

		if (this.games.get(socket.id)) {
			this.playerDisconnect(socket).then(URLJoin);
		} else {
			URLJoin();
		}
	}

	addNewPlayerToLobby(socket, playerName) {
		this.players.set(socket.id, new Player(playerName, socket.id));
		this.games.set(socket.id, null);
		socket.join('lobby');
		this.updatePlayerUUID(this.players.get(socket.id));
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
		socket.emit(ActionNames.UPDATE_GAME_JOINED, {gameJoined: true, gameID: gameID});

		game.initPlayerBoard(player);
		this.updateGameState(player);

		game.players.forEach( player => {
			this.updateShadowBoard(player);
		});
	}

	createGame(socket, gameID) {
		let player = this.players.get(socket.id);
		let game = new Game(player, gameID ? gameID : this.getValidGameID());
		this.games.set(socket.id, game);
		game.init();
		socket.leave('lobby');
		socket.join(game.id);
		this.updateHostList();
		socket.emit(ActionNames.UPDATE_GAME_JOINED, {gameJoined: true, gameID: game.id});
		game.initPlayerBoard(player);
		this.updateGameState(player);
		this.updateHostStatus(player);
	}

	getValidGameID() {
		let i = 0;
		while (this.getGameByID(++i));
		return i;
	}

	startGame(socket) {
		let player = this.players.get(socket.id);
		let game = this.games.get(socket.id);

		if (game.host.socketID !== socket.id || game.isPlaying) return ;
		if (!game.isPlaying) {
			game.reset();
		}

		game.start();

		game.players.forEach( player => {
			player.board.setNextActivePiece();
			this.updateGameState(player);
		});

		game.ticFunction = () => {
			game.players.forEach( player => {
				if (player.board.gameOver) return ;
				if (!player.board.moveDown()) {
					player.board.freezePiece(player.board.activePiece);
					player.board.removeFullLine();
					player.board.setNextActivePiece();

					this.updateShadowBoard(player);
				}
				this.updateGameState(player);
			});

			let bestScorePlayer = null;

			game.players.forEach( player => {
				if (player.isWinner) {
					this.io.to(player.socketID).emit(ActionNames.IS_WINNER);
				}
				if (bestScorePlayer == null || player.score > bestScorePlayer.score) {
					bestScorePlayer = player;
				}
				if (player.board.gameOver) {
					if (!game.playersLostList.includes(player.uuid)) {
						game.playersLostList.unshift(player.uuid);
					}
				}
			});

			// if all players' boards are game over
			if (game.players.every( player => player.board.gameOver )) {
				clearInterval(game.interval);
				this.io.to(game.id).emit(ActionNames.END_GAME, game.playersLostList);

				game.isPlaying = false;
				this.writeBestScore( game.players.map( player => {
					return ({playerName: player.name, score: player.score});
				}));
				this.updateHostList();
			}
		};

		game.setGameTic();
		this.updateHostList();

		this.io.to(game.id).emit(ActionNames.UPDATE_GAME_START);
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
			case "savePiece":
				player.board.savePiece();
				this.updateGameState(player);
			default: break;
		}
	}

	setInvisibleMode(socket, action) {
		let player = this.players.get(socket.id);
		let game = this.games.get(socket.id);
		if (game.host.socketID !== socket.id || game.isPlaying) return ;

		game.setInvisibleMode(action);
	}

	playerDisconnect(socket) {
		return new Promise((resolve, reject) => {
			this.lock.acquire("K", done => {
				let game = this.games.get(socket.id);
				let player = this.players.get(socket.id);
				if (player && game) {
					this.updateShadowBoard(player, false);
				}
				socket.leave('lobby');
				this.players.delete(socket.id);
				this.games.delete(socket.id);
				if (!game) { done(); return ;}

				game.players = game.players.filter( player => player.socketID != socket.id);

				if (game.players.length == 0) {
					game.isPlaying = false;
					this.updateHostList();
					clearInterval(game.interval);
				}
				else if (game.host.socketID == socket.id) {
					game.host = game.players[0];
					this.io.to(game.host.socketID).emit(ActionNames.UPDATE_HOST_STATUS, true);
				}
				socket.leave(game.id, ( () => {
						done();
					})
				);
			})
			.then(resolve);
		});

	}

	writeBestScore(playerScores) {
		this.lock.acquire("writeHighScores", done => {

			let filePath = __dirname + '/../../../bestScore';

			let highScore = this.readBestScore( highScores => {
				highScores.push(...playerScores);
				highScores.sort((a, b) => b.score - a.score)
				highScores = highScores.slice(0, 9);

				fs.writeFile(filePath, JSON.stringify(highScores), (err) => {
					if (err) console.log(err);
				});
				return highScores;
			})

		    done();
		})
	}

	readBestScore(cb) {

		let filePath = __dirname + '/../../../bestScore';
		fs.readFile(filePath, (err, data) => {
			let highScores = null;
			try {
				highScores = JSON.parse(data);
			} catch (err) {
				highScores = [];
			}
			if (cb) {
				cb(highScores);
			}
		})
	}
}

export default Server

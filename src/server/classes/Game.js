import Piece from './Piece'
import Board from './Board'
import Server from './Server'

import * as ActionNames from '../serverActions'

class Game {
	static gameCount = 0;
	static maxPlayers = 4;
	static newPiecesCount = 10;

	constructor( player, gameID ) {
		this.id = Game.gameCount++;
		this.host = player;
		this.isPlaying = false;
		this.players = [player];
		this.piecesList = [];
		this.level = 0; // determines piece speed and score
		this.highestScore = 0;
		this.interval = undefined;
		if (gameID) {
			this.id = gameID;
		}

		console.log("Creating Game with id #", this.id);
	}

	getInfo() {
		return {
			id: this.id,
			hostName: this.host.name,
			playerCount: this.players.length
		};
	}

	init() {
		// add pieces
		console.log("[Game.js] init");
		this.addPieces();
	}

	initPlayerBoard( player ) {
		console.log("[Game.js] initPlayerBoard");

		player.board = new Board({
			getPiecesFromGame: (board) => {
				if (board.piecesCopiedCount - this.piecesList.length < 5) {
					this.piecesList.push(...Piece.generateRandomPieces(Game.newPiecesCount));
				}
				if (board.piecesList.length < 5) {
					board.addPieces(
						this.piecesList.slice(board.piecesCopiedCount, board.piecesCopiedCount + 5).map( piece => {
							return new Piece(piece);
						})
					);
					board.piecesCopiedCount += 5;
				}
			},
			updateScoreAndFrozenLinesInGame: (linesRemoved) => {
				// update player score
				const multiplier = [40, 100, 300, 1200];
				player.score += multiplier[linesRemoved - 1] * (this.level + 1);
				console.log("player score: ", player.score);
				// update game level
				this.updateGameLevel(player.score);

				if (linesRemoved >= 2) {
					this.players.forEach((p) => {
						if (player.socketID != p.socketID) {
							p.board.frozenLines++;
						}
					})
				}
			}
		});
	}

	setGameTic() {
		let ticTime = 1000 / Math.log2(this.level + 2);

		if (this.interval != undefined) {
			clearInterval(this.interval);
		}
		this.interval = setInterval(this.ticFunction, ticTime);
	}

	updateGameLevel(playerScore) {
		const thresholds = [1200, 2400, 3600, 4800, 6000, 7200, 8400, 9600, 10800, 12000];

		if (playerScore > this.highestScore) {
			this.highestScore = playerScore;
			if (this.highestScore > thresholds[this.level] && this.level < thresholds.length - 1) {
				while (this.highestScore > thresholds[this.level] && this.level < thresholds.length - 1) {
					this.level++;
					console.log("level: ", this.level);
				}
				this.setGameTic();
			}
		}
	}

	start () {
		console.log("[Game.js] start");
		if (this.isPlaying) {
			console.log("Espece d'enfoiré, arrête ca!");
			return ;
		}
		this.isPlaying = true;
	}

	addPieces() {
		console.log("[Game.js] addPieces (generateRandomPieces)");
		this.piecesList.push(...Piece.generateRandomPieces(Game.newPiecesCount));
	}

}

export default Game

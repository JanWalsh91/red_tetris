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
		this.level = 0;
		this.highestScore = 0;
		this.interval = undefined;
		if (gameID) {
			this.id = gameID;
		}
		this.playersLostList = [];
	}

	getInfo() {
		return {
			id: this.id,
			hostName: this.host.name,
			playerCount: this.players.length
		};
	}

	init() {
		this.addPieces();
	}

	initPlayerBoard( player ) {
		if (!player) return ;

		player.board = new Board({
			getPiecesFromGame: (board) => {
				if (board.piecesCopiedCount - this.piecesList.length < 5) {
					this.piecesList.push(...Piece.generateRandomPieces(Game.newPiecesCount));
				}
				if (board.piecesList.length < 5) {
					board.addPieces(this.piecesList.slice(board.piecesCopiedCount, board.piecesCopiedCount + 5).map( piece => new Piece(piece) ));
					board.piecesCopiedCount += 5;
				}
			},
			updateScoreAndFrozenLinesInGame: (linesRemoved) => {
				const multiplier = [40, 100, 250, 600];
				player.score += multiplier[linesRemoved - 1] * (this.level + 1);
				this.updateGameLevel(player.score);

				if (linesRemoved >= 2) {
					this.players.forEach((p) => {
						if (player.socketID != p.socketID) {
							p.board.frozenLines += linesRemoved - 1;
						}
					})
				}
			},
			checkForEndGame: () => {
				if (this.players.every( p => p.board.gameOver)) {
					player.isWinner = true;
				}
			}
		});
	}

	reset() {
		this.players.forEach(player => {
			player.reset();
			player.board.reset();
		})
		this.piecesList = [];
	}

	setGameTic() {
		let ticTime = 1000 / Math.log2(this.level + 2);

		if (this.interval != undefined) {
			clearInterval(this.interval);
		}
		this.interval = setInterval(this.ticFunction, ticTime);
	}

	updateGameLevel(playerScore) {
		const thresholds = [600, 1800, 3600, 6000, 9000, 12600, 16800, 21600, 27000, 33000];
		if (playerScore > this.highestScore) {
			this.highestScore = playerScore;
			if (this.highestScore > thresholds[this.level] && this.level < thresholds.length - 1) {
				while (this.highestScore > thresholds[this.level] && this.level < thresholds.length - 1) {
					this.level++;
				}
				this.setGameTic();
			}
		}
	}

	setInvisibleMode(invisibleMode) {
		this.players.forEach(player => {
			player.board.setInvisibleMode(invisibleMode);
		})
	}

	start () {
		this.isPlaying = true;
	}

	addPieces() {
		this.piecesList.push(...Piece.generateRandomPieces(Game.newPiecesCount));
	}

}

export default Game

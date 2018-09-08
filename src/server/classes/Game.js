import Piece from './Piece'
import Board from './Board'
import Server from './Server'

import * as ActionNames from '../serverActions'

class Game {
	static gameCount = 0;
	static maxPlayers = 4;
	static newPiecesCount = 10;

	constructor( player ) {
		this.id = Game.gameCount++;
		this.host = player;
		this.isPlaying = false;
		this.players = [player];
		this.piecesList = [];
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
		// create board for each player
		this.players.forEach( player => this.initPlayerBoard(player) );
	}

	initPlayerBoard( player ) {
		console.log("[Game.js] initPlayerBoard");

		player.board = new Board({
			gameCallback: (board) => {
				// console.log("[Game.js] initPlayerBoard callback");

				// check if need to add more pieces to big pieceList
				// console.log("board.piecesCopiedCount:", board.piecesCopiedCount);
				// console.log("this.piecesList.length:", this.piecesList.length);
				if (board.piecesCopiedCount - this.piecesList.length < 5) {
					// add more pieces to big pieceList

					this.piecesList.push(...Piece.generateRandomPieces(Game.newPiecesCount));
				}
				// console.log("board.piecesCopiedCount:", board.piecesCopiedCount);
				// console.log("this.piecesList.length:", this.piecesList.length);

				// check if need to copy pieces to board piecesList
				if (board.piecesList.length < 5) {
					// copy pieces to board.piecesList
					board.addPieces(
						this.piecesList.slice(board.piecesCopiedCount, board.piecesCopiedCount + 5).map( piece => {
							return new Piece(piece);
						})
					);
					board.piecesCopiedCount += 5;
				}
			}
		});
	}

	start () {
		console.log("[Game.js] start");
		if (this.isPlaying) {
			console.log("Espece d'enfoiré, arrête ca!");
			return ;
		}
		this.players.forEach( player => {
			player.board.setNextActivePiece();
			player.interval = setInterval(() => {
				// console.log("Interval player", player.socketID);
				let moved = player.board.moveDown();
				if (!moved) {
					player.board.freezePiece();
					player.board.removeFullLine();
					player.board.setNextActivePiece();

					Server.updateShadowBoard(this.id, player);
					// io.to(this.id).emit(ActionNames.UPDATE_SHADOW_STATE, shadowCellData);
				}
				player.socket.emit(ActionNames.UPDATE_GAME_STATE, player.board.getCells());
				if (player.board.gameOver) {
					player.stopGame();
				}
			}, 1000);
			player.socket.emit(ActionNames.UPDATE_GAME_STATE, player.board.getCells());
		});
		this.isPlaying = true;
	}

	addPieces() {
		console.log("[Game.js] addPieces (generateRandomPieces)");
		this.piecesList.push(...Piece.generateRandomPieces(Game.newPiecesCount));
	}

}

export default Game

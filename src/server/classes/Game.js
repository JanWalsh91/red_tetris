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
	}

	initPlayerBoard( player ) {
		console.log("[Game.js] initPlayerBoard");

		player.board = new Board({
			gameCallback: (board) => {
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
			}
		});
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

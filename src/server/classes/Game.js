import Piece from './Piece'
import Board from './Board'

class Game {
	static gameCount = 0;
	static maxPlayers = 4;
	static newPiecesCount = 10;

	constructor( player ) {
		this.id = Game.gameCount++;
		this.host = player;
		this.isPlaying = false;
		this.players = [player];
		this.pieceList = [];
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
		this.addPieces();
		// create board for each player
		this.players.forEach( player => this.initPlayerBoard(player) );
	}

	initPlayerBoard( player ) {
		player.board = new Board({
			gameCallback: (board) => {
				// check if need to add more pieces to big pieceList
				if (board.piecesCopiedCount - this.piecesList.length < 5) {
					// add more pieces to big pieceList
					this.piecesList.push(Pieces.generateRandomPieces(Game.newPiecesCount));
				}

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

	startGame() {
		//?
	}

	addPieces() {
		this.pieceList.push(Piece.generateRandomPieces(Game.newPiecesCount));
	}

}

export default Game

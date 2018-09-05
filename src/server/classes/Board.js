// import Piece from './Piece'

// for testing:
var Piece = require('./Piece').Piece;

class Board {
	constructor( params ) {
		let defaultBoardParams = {
			size: {x: 10, y : 20}
		}
		params = {...defaultBoardParams, ...params};
		this.size = params.size;
		this.cells = new Array(this.size.x);
		for (let i = 0; i < this.size.x; i++) {
			this.cells[i] = new Array(this.size.y).fill(0x0);
		}
	}

	addPiece( piece ) {
		if (!piece) return;
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				this.cells[piece.coords.x + x][piece.coords.y + y] = piece.shape[x][y];
			}
		}
	}
}

// for testing
let board = new Board(
	{
		size: {x: 10, y: 20}
	}
);

// console.log("board: ", board);
let piece = new Piece(1);
board.addPiece(piece);
console.log("board: ", board);

// export default Board;

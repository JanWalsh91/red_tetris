// import Piece from './Piece'

// for testing:
var Piece = require('./Piece').Piece;

/*
*	Board:
*		size: {x, y}
*		cells: [[0x0, ...], [0xff0000, ...], ... ]
*		activePiece: Piece or null
*		piecesList: [Piece ...] or null
*/
class Board {
	/*
	*	Constructor params:
	*	{
	*		size: {x, y}				// board dimensions
	*		piecesList: [Piece ...]		// list of pieces
	*	}
	*	To prevent issues with references, pass anonymous parameters to constructor
	*/
	constructor( params ) {
		let defaultParams = {
			size: {x: 10, y : 20},
			piecesList: []
		}
		params = {...defaultParams, ...params};
		this.size = params.size;
		this.cells = new Array(this.size.x);
		for (let i = 0; i < this.size.x; i++) {
			this.cells[i] = new Array(this.size.y).fill(0x0);
		}
		this.activePiece = null;
		this.piecesList = params.piecesList;
	}

	/*
	*	Add pieces to piecesList
	*/
	addPieces( pieces ) {
		console.log("[Board.js] addPieces");
		if (!pieces || pieces.constructor !== Array || !(pieces[0] instanceof Piece))
			return ;
		this.piecesList.push(pieces);
	}

	/*
	*	Sets the next piece from piecesList as the activePiece
	*/
	setNextActivePiece() {
		console.log("[Board.js] setNextActivePiece");
		this.activePiece = this.piecesList.shift();
		if (!this.activePiece) {
			console.log("[Board.js] Error: no next piece available");
		}
	}

	/*
	*	Tries to rotate a piece or the activePiece. Returns piece (rotated or not).
	*	If a rotatedPiece cannot be placed, try to place it up to 2 squares left,
	*		2 squares right, or two squares up, in that order.
	*	Does not rotate on failure.
	*/
	// TODO: make functional function
	tryToRotatePiece( piece = this.activePiece ) {
		console.log("[Board.js] tryToRotatePiece");
		if (!piece) {console.log("\tno piece!"); return ;}

		// check board limitations and try to rotate
		let rotatedPiece = new Piece(piece);
		rotatedPiece.rotate();
		console.log("rotated piece: ", rotatedPiece);
		let canPlacePiece = this.pieceOverlaps(rotatedPiece);
		console.log("canPlacePiece: ", canPlacePiece);
		if (canPlacePiece) {
			this.activePiece = rotatedPiece;
			return rotatedPiece;
		}
		else {
			rotatedPiece = tryToMovePiece(rotatedPiece);
		}
		return piece;
	}

	/*
	*	Tries to move a piece or the activePiece. Returns piece (moved or not).
	*/
	// TODO: UPDATE (see below)
	tryToMovePiece( vector, piece = this.activePiece ) {
		console.log("[Board.js] tryToMovePiece, vector: ", vector);
		if (!piece) {console.log("\tno piece!"); return ;}
		if (!vector || vector.x == undefined || vector.y == undefined) {console.log("\tinvalid vector!");return piece;}

		let movedPiece = new Piece(piece);
		movedPiece.move(vector);
		let canPlacePiece = this.pieceOverlaps(movedPiece);
		console.log("canPlacePiece: ", canPlacePiece);
		if (canPlacePiece) {
			if (this.activePiece == piece) {
				this.activePiece = movedPiece;
			}
		}
	}

	/*
	*	Checks if the piece or activePiece can exist on this board
	*/
	// TODO: UPDATE (see below)
	pieceOverlaps( piece = this.activePiece ) {
		console.log("[Board.js] pieceOverlaps");
		if (!piece) return false;
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				if (piece.cells[x][y] != 0x0) {
					// if non-null piece cell outside of board
					if (piece.coords.x + x >= this.size.x || piece.coords.x + x < 0 || piece.coords.y + y >= this.size.y || piece.coords.y + y < 0) {
						console.log("[Board.js] Piece out of board bounds. coords: ", {x: piece.coords.x + x, y: piece.coords.y + y});
						return false;
					}
					// if non-null piece cell on a non-null board cell
					else if (this.cells[piece.coords.x + x][piece.coords.y + y] != 0x0 && piece.cells[x][y] != 0x0) {
						console.log("[Board.js] Piece overlapping at ", {x: piece.coords.x + x, y: piece.coords.y + y}, ", piece: ", piece.cells[x][y], "board: ", this.cells[piece.coords.x + x][piece.coords.y + y]);
						return false;
					}
				}
			}
		}
		return true;
	}

	/*
	*	Copies piece's or activePiece's colors to board, regardless of colors on
	*		board (call when piece reaches floor)
	*/
	freezePiece( piece = this.activePiece ) {
		console.log("[Board.js] freezePiece");
		// if (!piece) piece = this.activePiece;
		if (!piece) return ;
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				if (piece.cells[x][y] != 0x0) {
					this.cells[piece.coords.x + x][piece.coords.y + y] = piece.cells[x][y];
				}
			}
		}
	}

	printCells() {
		// console.clear();
		console.log("[Board.js] printCells");
		for (let y = 0; y < this.size.y; y++) {
			let line = "";
			for (let x = 0; x < this.size.x; x++) {
				line += (this.cells[x][y] ? "1" : "0") + " ";
			}
			console.log(line);
		}
	}

	// TODO: create functions for actions requested by client. Modifies activePiece if possible
	// Change tryToMovePiece and tryToRotatePiece to not modify activePiece.
	// Update piece passed as param, and return true or false if can be placed
	rotate() {

	}

	moveLeft() {

	}

	moveRight() {

	}

	moveDown() {
		// if move down cannot be done, freezePiece and setNextActivePiece ?
	}
}

// for testing
let board = new Board(
	{
		size: {x: 10, y: 20},
		piecesList: [new Piece(0), new Piece(0), new Piece(0)]
	}
);

// board.setNextActivePiece();
//
// board.printCells();
//
// board.tryToRotatePiece();
// board.freezePiece();
// board.setNextActivePiece();
//
// board.printCells();
//
// board.tryToMovePiece({x: -4, y: 0});
// board.freezePiece();
// board.setNextActivePiece();
//
// board.printCells();





// export default Board;

import Piece from './Piece'

// for testing:
// var Piece = require('./Piece').Piece;

/*
*	Board:
*		size: {x, y}
*		cells: [[0x0, ...], [0xff0000, ...], ... ]
*		activePiece: Piece or null
*		piecesList: [Piece ...] or null
*		currentPieceIndex: 0
*/
class Board {
	/*
	*	Constructor params:
	*	{
	*		size: {x, y}				// board dimensions
	*		piecesList: [Piece ...]		// list of pieces
	*		currentPieceIndex: 0
	*	}
	*	To prevent issues with references, pass anonymous parameters to constructor
	*/
	constructor( params ) {
		let defaultParams = {
			size: {x: 10, y : 20},
			piecesList: [],
			piecesCopiedCount: 0,
			gameCallback: () => {console.log("no callback set");}
		}
		params = {...defaultParams, ...params};
		this.size = params.size;
		this.cells = new Array(this.size.y);
		for (let y = 0; y < this.size.y; y++) {
			this.cells[y] = new Array(this.size.x).fill(0x0);
		}
		this.activePiece = null;
		this.piecesList = params.piecesList;
		this.gameCallback = params.gameCallback;
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
		else {
			this.gameCallback(this);
		}
	}

	/*
	*	Tries to rotate a piece or the activePiece. Returns piece (rotated or not).
	*	If a rotatedPiece cannot be placed, try to place it up to 2 squares left,
	*		2 squares right, or two squares up, in that order.
	*	Does not rotate on failure.
	*/
	tryToRotatePiece( piece ) {
		console.log("[Board.js] tryToRotatePiece");
		if (!piece) {console.log("\tno piece!"); return ;}

		piece.rotate();
		console.log("\trotated piece: ", piece);
		return this.pieceIsPlaceable(piece);
	}

	/*
	*	Tries to move a piece or the activePiece. Returns piece (moved or not).
	*/
	tryToMovePiece( piece, vector ) {
		console.log("[Board.js] tryToMovePiece, vector: ", vector);
		if (!piece) {console.log("\tno piece!"); return ;}
		if (!vector || vector.x == undefined || vector.y == undefined) {console.log("\tinvalid vector!"); return piece;}

		piece.move(vector);
		return this.pieceIsPlaceable(piece);
	}

	/*
	*	Checks if the piece or activePiece can exist on this board
	*/
	pieceIsPlaceable( piece ) {
		console.log("[Board.js] pieceIsPlaceable");
		if (!piece) return false;
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if (piece.cells[y][x] != 0x0) {
					// if non-null piece cell outside of board
					if (piece.coords.x + x >= this.size.x || piece.coords.x + x < 0 || piece.coords.y + y >= this.size.y || piece.coords.y + y < 0) {
						console.log("[Board.js] Piece out of board bounds. coords: ", {x: piece.coords.x + x, y: piece.coords.y + y});
						return false;
					}
					// if non-null piece cell on a non-null board cell
					else if (this.cells[piece.coords.y + y][piece.coords.x + x] != 0x0 && piece.cells[y][x] != 0x0) {
						console.log("[Board.js] Piece overlapping at ", {x: piece.coords.x + x, y: piece.coords.y + y}, ", piece: ", piece.cells[y][x], "board: ", this.cells[piece.coords.y + y][piece.coords.x + x]);
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
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if (piece.cells[y][x] != 0x0) {
					this.cells[piece.coords.y + y][piece.coords.x + x] = piece.cells[y][x];
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
				line += (this.cells[y][x] ? "1" : "0") + " ";
			}
			console.log(line);
		}
	}

	// TODO: create functions for actions requested by client. Modifies activePiece if possible
	// Change tryToMovePiece and tryToRotatePiece to not modify activePiece.
	// Update piece passed as param, and return true or false if can be placed
	rotate() {
		console.log("[Board.js] rotate");
		if (!this.activePiece) return ;

		let rotatedPiece = new Piece(this.activePiece);
		// rotate copy
		let canPlace = this.tryToRotatePiece(rotatedPiece);
		if (!canPlace) {
			console.log("\tmove left 1");
			canPlace = this.tryToMovePiece(rotatedPiece, {x: -1, y: 0});
		}
		if (!canPlace) {
			console.log("\tmove left 2")
			canPlace = this.tryToMovePiece(rotatedPiece, {x: -1, y: 0});
		}
		if (!canPlace) {
			console.log("\tmove right 1")
			canPlace = this.tryToMovePiece(rotatedPiece, {x: 3, y: 0});
		}
		if (!canPlace) {
			console.log("\tmove right 2")
			canPlace = this.tryToMovePiece(rotatedPiece, {x: 1, y: 0});
		}
		if (!canPlace) {
			console.log("\tmove up 1")
			canPlace = this.tryToMovePiece(rotatedPiece, {x: -2, y: 1});
		}
		if (!canPlace) {
			console.log("\tmove up 2")
			canPlace = this.tryToMovePiece(rotatedPiece, {x: 0, y: 1});
		}
		if (canPlace) {
			console.log("\t\t=D")
			this.activePiece = rotatedPiece;
		}
	}

	moveLeft() {
		if (!this.activePiece) return ;

		let movedPiece = new Piece(this.activePiece);
		let canMove = this.tryToMovePiece(movedPiece, {x: -1, y: 0});
		if (canMove) {
			this.activePiece = movedPiece;
		}
	}

	moveRight() {
		if (!this.activePiece) return ;

		let movedPiece = new Piece(this.activePiece);
		let canMove = this.tryToMovePiece(movedPiece, {x: 1, y: 0});
		if (canMove) {
			this.activePiece = movedPiece;
		}
	}

	moveDown() {
		if (!this.activePiece) return ;

		let movedPiece = new Piece(this.activePiece);
		let canMove = this.tryToMovePiece(movedPiece, {x: 0, y: 1});
		if (canMove) {
			this.activePiece = movedPiece;
		}
		// if move down cannot be done, freezePiece and setNextActivePiece ?
	}

	// TODO: move down shortcut

	getCells() {
		let cells = JSON.parse(JSON.stringify(this.cells));
		if (!this.activePiece) return cells;
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if (this.activePiece.cells[y][x] != 0x0) {
					cells[this.activePiece.coords.y + y][this.activePiece.coords.x + x] = this.activePiece.cells[y][x];
				}
			}
		}
		return cells;
	}


	getShadowCells() {
		let shadowCells = JSON.parse(JSON.stringify(this.cells));
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++){
				if (this.activePiece.cells[y][x] != 0x0) {
					for (let z = this.activePiece.coords.y + y; z < this.board.size.y; z++) {
						shadowCells[z][this.activePiece.coords.x + x] = 0xdadada;
					}
				}
			}
		}
		return shadowCells;
	}
}

// for testing
// let board = new Board(
// 	{
// 		size: {x: 10, y: 20},
// 		piecesList: [new Piece(0), new Piece(0), new Piece(0)]
// 	}
// );

// board.setNextActivePiece();

// board.printCells();

// board.moveRight();
// board.moveRight();
// board.freezePiece();
// board.setNextActivePiece();

// board.rotate();
// board.freezePiece();

// board.printCells();

// console.log(board.getCells());
//
// board.tryToMovePiece({x: -4, y: 0});
// board.freezePiece();
// board.setNextActivePiece();
//
// board.printCells();





export default Board;

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
*		gameOver: false
*		needToBroadcast: false
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
			gameOver: false,
			needToBroadcast: false,
			frozenLines: 0,
			removedLines: 0,
			savedPiece: null,
			getPiecesFromGame: () => {console.log("no callback set");},
			updateScoreAndFrozenLinesInGame: () => {console.log("no callback set");},
			checkForEndGame: () => {console.log("no callback set");}

		}
		params = {...defaultParams, ...params};
		this.size = params.size;
		this.cells = new Array(this.size.y);
		for (let y = 0; y < this.size.y; y++) {
			this.cells[y] = new Array(this.size.x).fill(0x0);
		}
		this.activePiece = null;
		this.savedPiece = null;
		this.piecesList = params.piecesList;
		this.piecesCopiedCount = params.piecesCopiedCount;
		this.gameOver = params.gameOver;
		this.needToBroadcast = params.needToBroadcast;
		this.frozenLines = params.frozenLines;
		this.removedLines = params.removedLines;
		this.getPiecesFromGame = params.getPiecesFromGame;
		this.updateScoreAndFrozenLinesInGame = params.updateScoreAndFrozenLinesInGame;
		this.checkForEndGame = params.checkForEndGame;
	}

	/*
	*	Add pieces to piecesList
	*/
	addPieces( pieces ) {
		// console.log("[Board.js] addPieces");
		if (!pieces || pieces.constructor !== Array || !(pieces[0] instanceof Piece))
			return ;
		// console.log(pieces);
		this.piecesList.push(...pieces);
		// console.log(this.piecesList);
	}

	/*
	*	Sets the next piece from piecesList as the activePiece
	*/
	setNextActivePiece() {
		// console.log("[Board.js] setNextActivePiece");
		this.getPiecesFromGame(this);
		this.activePiece = this.piecesList.shift();

		if (!this.activePiece) return;

		let isPlaceable = this.pieceIsPlaceable(this.activePiece);
		// console.log("[Board.js] isPlaceable: ", isPlaceable);
		if (!isPlaceable) {
			let movedPiece = new Piece(this.activePiece);
			movedPiece.move({x: 0, y: -1});
			// TODO: check if overlaps and move up again
			this.activePiece = movedPiece;
			this.gameOver = true;
			this.fillRed();
			this.checkForEndGame();
		} else {
			this.needToBroadcast = true;
		}
	}

	/*
	*	Tries to rotate a piece or the activePiece. Returns piece (rotated or not).
	*	If a rotatedPiece cannot be placed, try to place it up to 2 squares left,
	*		2 squares right, or two squares up, in that order.
	*	Does not rotate on failure.
	*/
	tryToRotatePiece( piece ) {
		// console.log("[Board.js] tryToRotatePiece");
		if (!piece) return ;

		piece.rotate();
		// console.log("\trotated piece to: ", piece.coords);
		return this.pieceIsPlaceable(piece);
	}

	/*
	*	Tries to move a piece or the activePiece. Returns piece (moved or not).
	*/
	tryToMovePiece( piece, vector ) {
		// console.log("[Board.js] tryToMovePiece, vector: ", vector);
		if (!piece) return ;
		if (!vector || vector.x == undefined || vector.y == undefined) return piece ;

		piece.move(vector);
		// console.log("\tmoved piece to: ", piece.coords);
		return this.pieceIsPlaceable(piece);
	}

	/*
	*	Checks if the piece or activePiece can exist on this board
	*/
	pieceIsPlaceable( piece ) {
		// console.log("[Board.js] pieceIsPlaceable");
		if (!piece) return false;
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if (piece.cells[y][x] != 0x0) {
					// if non-null piece cell outside of board
					if (piece.coords.x + x >= this.size.x || piece.coords.x + x < 0 || piece.coords.y + y >= this.size.y - this.frozenLines || piece.coords.y + y < 0) {
						// console.log("[Board.js] Piece out of board bounds. coords: ", {x: piece.coords.x + x, y: piece.coords.y + y});
						return false;
					}
					// if non-null piece cell on a non-null board cell
					else if (this.cells[piece.coords.y + y][piece.coords.x + x] != 0x0 && piece.cells[y][x] != 0x0) {
						// console.log("[Board.js] Piece overlapping at ", {x: piece.coords.x + x, y: piece.coords.y + y}, ", piece: ", piece.cells[y][x], "board: ", this.cells[piece.coords.y + y][piece.coords.x + x]);
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
		if (!piece) return ;
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if (piece.cells[y][x] != 0x0 && piece.coords.y >= 0) {
					this.cells[piece.coords.y + y][piece.coords.x + x] = piece.cells[y][x];
				}
			}
		}
		this.needToBroadcast = true;
	}

	// printCells() {
	// 	// console.clear();
	// 	console.log("[Board.js] printCells");
	// 	for (let y = 0; y < this.size.y; y++) {
	// 		let line = "";
	// 		for (let x = 0; x < this.size.x; x++) {
	// 			line += (this.cells[y][x] ? "1" : "0") + " ";
	// 		}
	// 		console.log(line);
	// 	}
	// }

	// TODO: create functions for actions requested by client. Modifies activePiece if possible
	// Change tryToMovePiece and tryToRotatePiece to not modify activePiece.
	// Update piece passed as param, and return true or false if can be placed
	rotate() {
		// console.log("[Board.js] rotate");
		if (!this.activePiece) return ;

		let rotatedPiece = new Piece(this.activePiece);
		// rotate copy
		let canPlace = this.tryToRotatePiece(rotatedPiece);
		if (!canPlace) canPlace = this.tryToMovePiece(rotatedPiece, {x: -1, y: 0});
		if (!canPlace) canPlace = this.tryToMovePiece(rotatedPiece, {x: -1, y: 0});
		if (!canPlace) canPlace = this.tryToMovePiece(rotatedPiece, {x: 3, y: 0});
		if (!canPlace) canPlace = this.tryToMovePiece(rotatedPiece, {x: 1, y: 0});
		if (!canPlace) canPlace = this.tryToMovePiece(rotatedPiece, {x: -2, y: -1});
		if (!canPlace) canPlace = this.tryToMovePiece(rotatedPiece, {x: 0, y: -1});
		if (canPlace) this.activePiece = rotatedPiece;
		return canPlace;
	}

	moveLeft() {
		if (!this.activePiece) return ;

		let movedPiece = new Piece(this.activePiece);
		let canMove = this.tryToMovePiece(movedPiece, {x: -1, y: 0});
		if (canMove) {
			this.activePiece = movedPiece;
		}
		return canMove;
	}

	moveRight() {
		if (!this.activePiece) return ;

		let movedPiece = new Piece(this.activePiece);
		let canMove = this.tryToMovePiece(movedPiece, {x: 1, y: 0});
		if (canMove) {
			this.activePiece = movedPiece;
		}
		return canMove;
	}

	moveDown() {
		if (!this.activePiece) return ;

		let movedPiece = new Piece(this.activePiece);
		let canMove = this.tryToMovePiece(movedPiece, {x: 0, y: 1});
		if (canMove) {
			this.activePiece = movedPiece;
		} else {
			// console.log("Cannot move down");
		}
		return canMove;
		// if move down cannot be done, freezePiece and setNextActivePiece ?
	}

	downShortcut() {
		if (!this.activePiece) return ;

		let canMove = false;
		for (let y = 0; y < this.size.y; y++) {
			let movedPiece = new Piece(this.activePiece);
			canMove = this.tryToMovePiece(movedPiece, {x: 0, y});
			if (!canMove && y > 0) {
				movedPiece = new Piece(this.activePiece);
				canMove = this.tryToMovePiece(movedPiece, {x: 0, y: y - 1});
				this.activePiece = movedPiece;
				this.freezePiece(this.activePiece);
				this.removeFullLine();
				this.setNextActivePiece();
				break;
			}

		}

		return canMove;
	}

	savePiece() {
		if (!this.activePiece) return ;

		if (this.savedPiece) {
			let oldActivePiece = new Piece(this.activePiece);
			this.activePiece = this.savedPiece;
			this.savedPiece = oldActivePiece;
		} else {
			this.savedPiece = this.activePiece;
			this.setNextActivePiece();
		}

	}

	removeFullLine() {
		if (this.gameOver) return;
		let numLinesRemoved = 0;
		for (let y = 0; y < this.size.y; y++) {
			let isFullLine = true;
			for (let x = 0; x < this.size.x; x++) {
				if (this.cells[y][x] == 0x0) {
					isFullLine = false;
				}
			}
			if (isFullLine) {
				numLinesRemoved++;
				for (let z = y; z > 0; z--) {
					this.cells[z] = this.cells[z - 1].slice();
				}
				this.freezeLine = true;
			}
		}
		if (numLinesRemoved > 0) {
			this.removedLines += numLinesRemoved;
			this.updateScoreAndFrozenLinesInGame(numLinesRemoved);
		}
	}

	getCells() {
		// console.log("[Board.js] getCells <3");
		let cells = JSON.parse(JSON.stringify(this.cells));
		if (!this.activePiece) return cells;
		// console.log(this.activePiece);

		let canMove = false;
		for (let y = 0; y < this.size.y; y++) {
			let movedPiece = new Piece(this.activePiece);
			canMove = this.tryToMovePiece(movedPiece, {x: 0, y});
			if (!canMove && y > 0) {
				movedPiece = new Piece(this.activePiece);
				canMove = this.tryToMovePiece(movedPiece, {x: 0, y: y - 1});
				for (let y = 0; y < 4; y++) {
					for (let x = 0; x < 4; x++) {
						if (movedPiece.coords.y + y >= 0 && movedPiece.cells[y][x] != 0x0) {
							cells[movedPiece.coords.y + y][movedPiece.coords.x + x] = 'previewPiece';
						}
					}
				}
				break;
			}
		}

		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if (this.activePiece.coords.y + y >= 0 && this.activePiece.cells[y][x] != 0x0) {
					cells[this.activePiece.coords.y + y][this.activePiece.coords.x + x] = this.activePiece.cells[y][x];
				}
			}
		}

		for (let y = 0; y < this.frozenLines; y++) {
			cells[this.size.y - y - 1] = new Array(this.size.x).fill("frozenLine");
		}
		return cells;
	}

	// TODO: to remove
	// getBinaryCells() {
	// 	// console.log("[Board.js] getCells <3");
	// 	let cells = JSON.parse(JSON.stringify(this.cells));
	// 	if (!this.activePiece) return cells;
	// 	// console.log(this.activePiece);
	// 	for (let y = 0; y < 4; y++) {
	// 		for (let x = 0; x < 4; x++) {
	// 			if (this.activePiece.cells[y][x] != 0x0) {
	// 				cells[this.activePiece.coords.y + y][this.activePiece.coords.x + x] = 1;
	// 			}
	// 		}
	// 	}
	// 	for (let y = 0; y < this.size.y; y++) {
	// 		for (let x = 0; x < this.size.x; x++) {
	// 			if (this.cells[y][x] != 0x0) {
	// 				cells[y][x] = 1;
	// 			}
	// 		}
	// 	}
	// 	return cells;
	// }

	getShadowCells() {
		// console.log("[Board.js] getCells <3");
		let shadowCells = JSON.parse(JSON.stringify(this.cells));
		for (let y = 0; y < this.size.y; y++) {
			for (let x = 0; x < this.size.x; x++) {
				if (this.cells[y][x] != 0x0) {
					for (let z = y; z < this.size.y; z++) {
						shadowCells[z][x] = "gameOver";
					}
				}
			}
		}
		return shadowCells;
	}

	fillRed() {
		for (let y = 0; y < this.size.y; y++) {
			for (let x = 0; x < this.size.x; x++) {
				if (this.cells[y][x] == 0x0) {
					this.cells[y][x] = "gameOver";
				}
			}
		}
	}
}

export default Board;

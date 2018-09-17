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
			invisibleMode: false,
			getPiecesFromGame: () => {},
			updateScoreAndFrozenLinesInGame: () => {},
			checkForEndGame: () => {}

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
		this.invisibleMode = params.invisibleMode;
		this.getPiecesFromGame = params.getPiecesFromGame;
		this.updateScoreAndFrozenLinesInGame = params.updateScoreAndFrozenLinesInGame;
		this.checkForEndGame = params.checkForEndGame;
	}

	/*
	*	Add pieces to piecesList
	*/
	addPieces( pieces ) {
		if (!pieces || pieces.constructor !== Array || !(pieces[0] instanceof Piece))
			return ;
		this.piecesList.push(...pieces);
	}

	/*
	*	Sets the next piece from piecesList as the activePiece
	*/
	setNextActivePiece() {
		this.getPiecesFromGame(this);
		this.activePiece = this.piecesList.shift();

		if (!this.activePiece) return;

		let isPlaceable = this.pieceIsPlaceable(this.activePiece);
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
		if (!piece) return ;
		piece.rotate();
		return this.pieceIsPlaceable(piece);
	}

	/*
	*	Tries to move a piece or the activePiece. Returns piece (moved or not).
	*/
	tryToMovePiece( piece, vector ) {
		if (!piece) return ;
		if (!vector || vector.x == undefined || vector.y == undefined) return piece ;

		piece.move(vector);
		return this.pieceIsPlaceable(piece);
	}

	/*
	*	Checks if the piece or activePiece can exist on this board
	*/
	pieceIsPlaceable( piece ) {
		if (!piece) return false;
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if (piece.cells[y][x] != 0x0) {
					// if non-null piece cell outside of board
					if (piece.coords.x + x >= this.size.x || piece.coords.x + x < 0 || piece.coords.y + y >= this.size.y - this.frozenLines || piece.coords.y + y < 0) {
						return false;
					}
					// if non-null piece cell on a non-null board cell
					else if (this.cells[piece.coords.y + y][piece.coords.x + x] != 0x0 && piece.cells[y][x] != 0x0) {
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
					if (this.invisibleMode) {
						this.cells[piece.coords.y + y][piece.coords.x + x] = 'invisible';
					} else {
						this.cells[piece.coords.y + y][piece.coords.x + x] = piece.cells[y][x];
					}
				}
			}
		}
		this.needToBroadcast = true;
	}

	// TODO: create functions for actions requested by client. Modifies activePiece if possible
	// Change tryToMovePiece and tryToRotatePiece to not modify activePiece.
	// Update piece passed as param, and return true or false if can be placed
	rotate() {
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
		let cells = JSON.parse(JSON.stringify(this.cells));
		if (!this.activePiece) return cells;
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

	setInvisibleMode(invisibleMode) {
		this.invisibleMode = invisibleMode;
	}

	reset() {
		this.cells = new Array(this.size.y);
		for (let y = 0; y < this.size.y; y++) {
			this.cells[y] = new Array(this.size.x).fill(0x0);
		}
		this.activePiece = null;
		this.savedPiece = null;
		this.gameOver = false;
	}

	getShadowCells() {
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

'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Piece = require('./Piece');

var _Piece2 = _interopRequireDefault(_Piece);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var Board = function () {
	/*
 *	Constructor params:
 *	{
 *		size: {x, y}				// board dimensions
 *		piecesList: [Piece ...]		// list of pieces
 *		currentPieceIndex: 0
 *	}
 *	To prevent issues with references, pass anonymous parameters to constructor
 */
	function Board(params) {
		_classCallCheck(this, Board);

		var defaultParams = {
			size: { x: 10, y: 20 },
			piecesList: [],
			piecesCopiedCount: 0,
			gameOver: false,
			needToBroadcast: false,
			frozenLines: 0,
			removedLines: 0,
			savedPiece: null,
			invisibleMode: false,
			getPiecesFromGame: function getPiecesFromGame() {},
			updateScoreAndFrozenLinesInGame: function updateScoreAndFrozenLinesInGame() {},
			checkForEndGame: function checkForEndGame() {}

		};
		params = _extends({}, defaultParams, params);
		this.size = params.size;
		this.cells = new Array(this.size.y);
		for (var y = 0; y < this.size.y; y++) {
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


	_createClass(Board, [{
		key: 'addPieces',
		value: function addPieces(pieces) {
			var _piecesList;

			if (!pieces || pieces.constructor !== Array || !(pieces[0] instanceof _Piece2.default)) return;
			(_piecesList = this.piecesList).push.apply(_piecesList, _toConsumableArray(pieces));
		}

		/*
  *	Sets the next piece from piecesList as the activePiece
  */

	}, {
		key: 'setNextActivePiece',
		value: function setNextActivePiece() {
			this.getPiecesFromGame(this);
			this.activePiece = this.piecesList.shift();

			if (!this.activePiece) return;

			var isPlaceable = this.pieceIsPlaceable(this.activePiece);
			if (!isPlaceable) {
				var movedPiece = new _Piece2.default(this.activePiece);
				movedPiece.move({ x: 0, y: -1 });
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

	}, {
		key: 'tryToRotatePiece',
		value: function tryToRotatePiece(piece) {
			if (!piece) return;
			piece.rotate();
			return this.pieceIsPlaceable(piece);
		}

		/*
  *	Tries to move a piece or the activePiece. Returns piece (moved or not).
  */

	}, {
		key: 'tryToMovePiece',
		value: function tryToMovePiece(piece, vector) {
			if (!piece) return;
			if (!vector || vector.x == undefined || vector.y == undefined) return piece;

			piece.move(vector);
			return this.pieceIsPlaceable(piece);
		}

		/*
  *	Checks if the piece or activePiece can exist on this board
  */

	}, {
		key: 'pieceIsPlaceable',
		value: function pieceIsPlaceable(piece) {
			if (!piece) return false;
			for (var y = 0; y < 4; y++) {
				for (var x = 0; x < 4; x++) {
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

	}, {
		key: 'freezePiece',
		value: function freezePiece() {
			var piece = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.activePiece;

			if (!piece) return;
			for (var y = 0; y < 4; y++) {
				for (var x = 0; x < 4; x++) {
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
	}, {
		key: 'rotate',
		value: function rotate() {
			if (!this.activePiece) return;

			var rotatedPiece = new _Piece2.default(this.activePiece);
			var canPlace = this.tryToRotatePiece(rotatedPiece);
			if (!canPlace) canPlace = this.tryToMovePiece(rotatedPiece, { x: -1, y: 0 });
			if (!canPlace) canPlace = this.tryToMovePiece(rotatedPiece, { x: -1, y: 0 });
			if (!canPlace) canPlace = this.tryToMovePiece(rotatedPiece, { x: 3, y: 0 });
			if (!canPlace) canPlace = this.tryToMovePiece(rotatedPiece, { x: 1, y: 0 });
			if (!canPlace) canPlace = this.tryToMovePiece(rotatedPiece, { x: -2, y: -1 });
			if (!canPlace) canPlace = this.tryToMovePiece(rotatedPiece, { x: 0, y: -1 });
			if (canPlace) this.activePiece = rotatedPiece;
			return canPlace;
		}
	}, {
		key: 'moveLeft',
		value: function moveLeft() {
			if (!this.activePiece) return;

			var movedPiece = new _Piece2.default(this.activePiece);
			var canMove = this.tryToMovePiece(movedPiece, { x: -1, y: 0 });
			if (canMove) {
				this.activePiece = movedPiece;
			}
			return canMove;
		}
	}, {
		key: 'moveRight',
		value: function moveRight() {
			if (!this.activePiece) return;

			var movedPiece = new _Piece2.default(this.activePiece);
			var canMove = this.tryToMovePiece(movedPiece, { x: 1, y: 0 });
			if (canMove) {
				this.activePiece = movedPiece;
			}
			return canMove;
		}
	}, {
		key: 'moveDown',
		value: function moveDown() {
			if (!this.activePiece) return;

			var movedPiece = new _Piece2.default(this.activePiece);
			var canMove = this.tryToMovePiece(movedPiece, { x: 0, y: 1 });
			if (canMove) {
				this.activePiece = movedPiece;
			}
			return canMove;
		}
	}, {
		key: 'downShortcut',
		value: function downShortcut() {
			if (!this.activePiece) return;

			var canMove = false;
			for (var y = 0; y < this.size.y; y++) {
				var movedPiece = new _Piece2.default(this.activePiece);
				canMove = this.tryToMovePiece(movedPiece, { x: 0, y: y });
				if (!canMove && y > 0) {
					movedPiece = new _Piece2.default(this.activePiece);
					canMove = this.tryToMovePiece(movedPiece, { x: 0, y: y - 1 });
					this.activePiece = movedPiece;
					this.freezePiece(this.activePiece);
					this.removeFullLine();
					this.setNextActivePiece();
					break;
				}
			}
			return canMove;
		}
	}, {
		key: 'savePiece',
		value: function savePiece() {
			if (!this.activePiece) return;

			if (this.savedPiece) {
				this.savedPiece.coords = { x: this.activePiece.coords.x, y: this.activePiece.coords.y };
				if (!this.pieceIsPlaceable(this.savedPiece)) return;

				var oldActivePiece = new _Piece2.default(this.activePiece);
				this.activePiece = this.savedPiece;
				this.savedPiece = oldActivePiece;
			} else {
				this.savedPiece = this.activePiece;
				this.setNextActivePiece();
			}
		}
	}, {
		key: 'removeFullLine',
		value: function removeFullLine() {
			if (this.gameOver) return;
			var numLinesRemoved = 0;
			for (var y = 0; y < this.size.y; y++) {
				var isFullLine = true;
				for (var x = 0; x < this.size.x; x++) {
					if (this.cells[y][x] == 0x0) {
						isFullLine = false;
					}
				}
				if (isFullLine) {
					numLinesRemoved++;
					for (var z = y; z > 0; z--) {
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
	}, {
		key: 'getCells',
		value: function getCells() {
			var cells = JSON.parse(JSON.stringify(this.cells));
			if (!this.activePiece) return cells;
			var canMove = false;
			for (var y = 0; y < this.size.y; y++) {
				var movedPiece = new _Piece2.default(this.activePiece);
				canMove = this.tryToMovePiece(movedPiece, { x: 0, y: y });
				if (!canMove && y > 0) {
					movedPiece = new _Piece2.default(this.activePiece);
					canMove = this.tryToMovePiece(movedPiece, { x: 0, y: y - 1 });
					for (var _y = 0; _y < 4; _y++) {
						for (var x = 0; x < 4; x++) {
							if (movedPiece.coords.y + _y >= 0 && movedPiece.cells[_y][x] != 0x0) {
								cells[movedPiece.coords.y + _y][movedPiece.coords.x + x] = 'previewPiece';
							}
						}
					}
					break;
				}
			}

			for (var _y2 = 0; _y2 < 4; _y2++) {
				for (var _x2 = 0; _x2 < 4; _x2++) {
					if (this.activePiece.coords.y + _y2 >= 0 && this.activePiece.cells[_y2][_x2] != 0x0) {
						cells[this.activePiece.coords.y + _y2][this.activePiece.coords.x + _x2] = this.activePiece.cells[_y2][_x2];
					}
				}
			}

			for (var _y3 = 0; _y3 < this.frozenLines; _y3++) {
				cells[this.size.y - _y3 - 1] = new Array(this.size.x).fill("frozenLine");
			}
			return cells;
		}
	}, {
		key: 'setInvisibleMode',
		value: function setInvisibleMode(invisibleMode) {
			this.invisibleMode = invisibleMode;
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.cells = new Array(this.size.y);
			for (var y = 0; y < this.size.y; y++) {
				this.cells[y] = new Array(this.size.x).fill(0x0);
			}
			this.activePiece = null;
			this.savedPiece = null;
			this.gameOver = false;
			this.piecesCopiedCount = 0;
			this.frozenLines = 0;
			this.removedLines = 0;
			this.piecesList = [];
		}
	}, {
		key: 'getShadowCells',
		value: function getShadowCells() {
			var shadowCells = JSON.parse(JSON.stringify(this.cells));
			for (var y = 0; y < this.size.y; y++) {
				for (var x = 0; x < this.size.x; x++) {
					if (this.cells[y][x] != 0x0) {
						for (var z = y; z < this.size.y; z++) {
							shadowCells[z][x] = "gameOver";
						}
					}
				}
			}
			return shadowCells;
		}
	}, {
		key: 'fillRed',
		value: function fillRed() {
			for (var y = 0; y < this.size.y; y++) {
				for (var x = 0; x < this.size.x; x++) {
					if (this.cells[y][x] == 0x0) {
						this.cells[y][x] = "gameOver";
					}
				}
			}
		}
	}]);

	return Board;
}();

exports.default = Board;
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
*	Class for a Tetris piece.
*	All pieces are represented in a 4x4 list of colors
*	Each piece has 4 possible orientations
*	Collision is checked for each non-null value against board values and positions.
* 	Piece:
*		type: int						// type of piece
*		orientation: int				// 0-3
*		cells: [[0x0, ... ], ... ]		// cells describing piece shape and color
*		coords: {x, y}
*
*/

var Piece = function () {
	_createClass(Piece, null, [{
		key: "generateRandomPiece",


		/*
  *	Generates a new piece. Rolls once for type. If same as lastPieceType,
  *	rolls again.
  */
		value: function generateRandomPiece(lastPieceType) {
			var newType = Math.floor(Math.random() * Piece.typeCount);
			if (newType === lastPieceType) {
				newType = Math.floor(Math.random() * Piece.typeCount);
			}
			return new Piece({ type: newType });
		}

		/*
  *	Generates and returns a list of num pieces.
  */

	}, {
		key: "generateRandomPieces",
		value: function generateRandomPieces(num) {
			if (!num) num = 1;
			var pieces = [];
			for (var i = 0; i < num; i++) {
				var lastPieceType = null;
				if (pieces.length > 0) lastPieceType = pieces[pieces.length - 1].type;
				pieces.push(Piece.generateRandomPiece(lastPieceType));
			}
			return pieces;
		}

		/*
  *	param is either an instance of Piece or an Integer between 0 and 7
  */

	}]);

	function Piece(params) {
		_classCallCheck(this, Piece);

		if (params instanceof Piece) {
			// Copy constructor
			params = {
				type: params.type,
				orientation: params.orientation,
				coords: _extends({}, params.coords)
			};
		}
		// Constructor with params
		var defaultParams = {
			type: 0,
			orientation: 0,
			coords: { x: 3, y: 0 }
		};
		params = _extends({}, defaultParams, params, { coords: _extends({}, params && params.coords ? params.coords : defaultParams.coords) });

		if (params.type < 0 || params.type >= Piece.typeCount) {
			return null;
		}
		this.type = params.type;
		this.orientation = params.orientation;
		this.cells = Piece.types[this.type][this.orientation];
		this.coords = params.coords;
	}

	/*
 *	Tetris rotation rules:
 *	- attempt to place rotated piece without changing coords.
 *	- if rotated piece cannot be placed because of pieces on board or edge
 *		board, try to placed the rotated piece left, right then up by two
 *		coord.
 *	- if cannot be placed, do nothing.
 */

	_createClass(Piece, [{
		key: "rotate",
		value: function rotate() {
			this.orientation = (this.orientation + 1) % 4;
			this.cells = Piece.types[this.type][this.orientation];
		}
	}, {
		key: "move",
		value: function move() {
			var vector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { x: 0, y: 1 };

			if (!Number.isInteger(vector.x) || !Number.isInteger(vector.y)) {
				return;
			}
			this.coords.x += vector.x;
			this.coords.y += vector.y;
		}
	}]);

	return Piece;
}();

// Welcome to static class variables in Javascript:


Piece.typeCount = 7;
Piece.types = [
// cyan line
[[[0x0, 0x0, 0x0, 0x0], ["line", "line", "line", "line"], [0x0, 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, 0x0, "line", 0x0], [0x0, 0x0, "line", 0x0], [0x0, 0x0, "line", 0x0], [0x0, 0x0, "line", 0x0]], [[0x0, 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0], ["line", "line", "line", "line"], [0x0, 0x0, 0x0, 0x0]], [[0x0, "line", 0x0, 0x0], [0x0, "line", 0x0, 0x0], [0x0, "line", 0x0, 0x0], [0x0, "line", 0x0, 0x0]]],
// blue L
[[["l1", 0x0, 0x0, 0x0], ["l1", "l1", "l1", 0x0], [0x0, 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, "l1", "l1", 0x0], [0x0, "l1", 0x0, 0x0], [0x0, "l1", 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, 0x0, 0x0, 0x0], ["l1", "l1", "l1", 0x0], [0x0, 0x0, "l1", 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, "l1", 0x0, 0x0], [0x0, "l1", 0x0, 0x0], ["l1", "l1", 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]]],
// orange L
[[[0x0, 0x0, "l2", 0x0], ["l2", "l2", "l2", 0x0], [0x0, 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, "l2", 0x0, 0x0], [0x0, "l2", 0x0, 0x0], [0x0, "l2", "l2", 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, 0x0, 0x0, 0x0], ["l2", "l2", "l2", 0x0], ["l2", 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [["l2", "l2", 0x0, 0x0], [0x0, "l2", 0x0, 0x0], [0x0, "l2", 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]]],
// yellow square
[[[0x0, "square", "square", 0x0], [0x0, "square", "square", 0x0], [0x0, 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, "square", "square", 0x0], [0x0, "square", "square", 0x0], [0x0, 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, "square", "square", 0x0], [0x0, "square", "square", 0x0], [0x0, 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, "square", "square", 0x0], [0x0, "square", "square", 0x0], [0x0, 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]]],
// green squiggle
[[[0x0, "squiggle1", "squiggle1", 0x0], ["squiggle1", "squiggle1", 0x0, 0x0], [0x0, 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, "squiggle1", 0x0, 0x0], [0x0, "squiggle1", "squiggle1", 0x0], [0x0, 0x0, "squiggle1", 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, 0x0, 0x0, 0x0], [0x0, "squiggle1", "squiggle1", 0x0], ["squiggle1", "squiggle1", 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [["squiggle1", 0x0, 0x0, 0x0], ["squiggle1", "squiggle1", 0x0, 0x0], [0x0, "squiggle1", 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]]],
// purple T
[[[0x0, "t", 0x0, 0x0], ["t", "t", "t", 0x0], [0x0, 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, "t", 0x0, 0x0], [0x0, "t", "t", 0x0], [0x0, "t", 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, 0x0, 0x0, 0x0], ["t", "t", "t", 0x0], [0x0, "t", 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, "t", 0x0, 0x0], ["t", "t", 0x0, 0x0], [0x0, "t", 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]]],
// red squiggle
[[["squiggle2", "squiggle2", 0x0, 0x0], [0x0, "squiggle2", "squiggle2", 0x0], [0x0, 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, 0x0, "squiggle2", 0x0], [0x0, "squiggle2", "squiggle2", 0x0], [0x0, "squiggle2", 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, 0x0, 0x0, 0x0], ["squiggle2", "squiggle2", 0x0, 0x0], [0x0, "squiggle2", "squiggle2", 0x0], [0x0, 0x0, 0x0, 0x0]], [[0x0, "squiggle2", 0x0, 0x0], ["squiggle2", "squiggle2", 0x0, 0x0], ["squiggle2", 0x0, 0x0, 0x0], [0x0, 0x0, 0x0, 0x0]]]];

exports.default = Piece;
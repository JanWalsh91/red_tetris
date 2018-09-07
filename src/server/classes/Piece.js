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

class Piece {

	/*
	*	Generates a new piece. Rolls once for type. If same as lastPieceType,
	*	rolls again.
	*/
	static generateRandomPiece(lastPieceType) {
		let newType = Math.floor(Math.random() * (Piece.typeCount));
		if (newType === lastPieceType) {
			newType = Math.floor(Math.random() * (Piece.typeCount));
		}
		return new Piece({type: newType});
	}

	/*
	*	Generates and returns a list of num pieces.
	*/
	static generateRandomPieces(num) {
		if (!num) num = 1;
		let pieces = [];
		for (let i = 0; i < num; i++) {
			let lastPieceType = null;
			if (pieces.length > 0)
				lastPieceType = pieces[pieces.length - 1].type;
			pieces.push( Piece.generateRandomPiece(lastPieceType) );
		}
		return pieces;
	}

	/*
	*	param is either an instance of Piece or an Integer between 0 and 7
	*/
	constructor( params ) {
		if (params instanceof Piece) {
			// Copy constructor
			console.log("[Piece.js] Piece constructor COPY");
			params = {
				type: params.type,
				orientation: params.orientation,
				coords: { ...params.coords }
			};
		}
		// Constructor with params
		console.log("[Piece.js] Piece constructor PARAMS");
		let defaultParams = {
			type: 0,
			orientation: 0,
			coords: {x: 3, y: 0}
		};
		params = {...defaultParams, ...params, coords: {...(params.coords ? params.coords : defaultParams.coords)}};

	 	if (params.type < 0 || params.type >= Piece.typeCount) {
			console.log("[Piece.js] invalid piece parameters");
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

	rotate() {
		this.orientation = (this.orientation + 1) % 4;
		console.log("[Piece.js] new orientation: ", this.orientation);
		this.cells = Piece.types[this.type][this.orientation];
	}

	move( vector = {x: 0, y : 1} ) {
		console.log("[Piece.js] move. vector: ", vector);
		if (!Number.isInteger(vector.x) || !Number.isInteger(vector.y)){
			console.log("   vector invalid");
			return ;
		}
		this.coords.x += vector.x;
		this.coords.y += vector.y;
		console.log("piece moved: ", this.coords);
	}
}

// Welcome to static class variables in Javascript:
Piece.typeCount = 7;
Piece.types = [
	// cyan line
	[
		[
			[0x0,		0x0,		0x0,		0x0],
			["line",	"line",		"line",		"line"],
			[0x0,		0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		0x0,		"line",	0x0],
			[0x0,		0x0,		"line",	0x0],
			[0x0,		0x0,		"line",	0x0],
			[0x0,		0x0,		"line",	0x0],
		],
		[
			[0x0,		0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
			["line",	"line",		"line",		"line"],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		"line",	0x0,		0x0],
			[0x0,		"line",	0x0,		0x0],
			[0x0,		"line",	0x0,		0x0],
			[0x0,		"line",	0x0,		0x0],
		]
	],
	// blue L
	[
		[
			["l1",	0x0,		0x0,		0x0],
			["l1",	"l1",	"l1",	0x0],
			[0x0,		0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		"l1",	"l1",	0x0],
			[0x0,		"l1",	0x0,		0x0],
			[0x0,		"l1",	0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		0x0,		0x0,		0x0],
			["l1",	"l1",	"l1",	0x0],
			[0x0,		0x0,		"l1",	0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		"l1",	0x0,		0x0],
			[0x0,		"l1",	0x0,		0x0],
			["l1",	"l1",	0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		]
	],
	// orange L
	[
		[
			[0x0,		0x0,		"l2",	0x0],
			["l2",	"l2",	"l2",	0x0],
			[0x0,		0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		"l2",	0x0,		0x0],
			[0x0,		"l2",	0x0,		0x0],
			[0x0,		"l2",	"l2",	0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		0x0,		0x0,		0x0],
			["l2",	"l2",	"l2",	0x0],
			["l2",	0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			["l2",	"l2",	0x0,		0x0],
			[0x0,		"l2",	0x0,		0x0],
			[0x0,		"l2",	0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		]
	],
	// yellow square
	[
		[
			[0x0,		"square",	"square",	0x0],
			[0x0,		"square",	"square",	0x0],
			[0x0,		0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		"square",	"square",	0x0],
			[0x0,		"square",	"square",	0x0],
			[0x0,		0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		"square",	"square",	0x0],
			[0x0,		"square",	"square",	0x0],
			[0x0,		0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		"square",	"square",	0x0],
			[0x0,		"square",	"square",	0x0],
			[0x0,		0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		]
	],
	// green squiggle
	[
		[
			[0x0,		"squiggle1",	"squiggle1",	0x0],
			["squiggle1",	"squiggle1",	0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		"squiggle1",	0x0,		0x0],
			[0x0,		"squiggle1",	"squiggle1",	0x0],
			[0x0,		0x0,		"squiggle1",	0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		0x0,		0x0,		0x0],
			[0x0,		"squiggle1",	"squiggle1",	0x0],
			["squiggle1",	"squiggle1",	0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			["squiggle1",	0x0,		0x0,		0x0],
			["squiggle1",	"squiggle1",	0x0,		0x0],
			[0x0,		"squiggle1",	0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		]
	],
	// purple T
	[
		[
			[0x0,		"t",	0x0,		0x0],
			["t",	"t",	"t",	0x0],
			[0x0,		0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		"t",	0x0,		0x0],
			[0x0,		"t",	"t",	0x0],
			[0x0,		"t",	0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		0x0,		0x0,		0x0],
			["t",	"t",	"t",	0x0],
			[0x0,		"t",	0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		"t",	0x0,		0x0],
			["t",	"t",	0x0,		0x0],
			[0x0,		"t",	0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		]
	],
	// red squiggle
	[
		[
			["squiggle2",	"squiggle2",	0x0,		0x0],
			[0x0,		"squiggle2",	"squiggle2",	0x0],
			[0x0,		0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		0x0,		"squiggle2",	0x0],
			[0x0,		"squiggle2",	"squiggle2",	0x0],
			[0x0,		"squiggle2",	0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		0x0,		0x0,		0x0],
			["squiggle2",	"squiggle2",	0x0,		0x0],
			[0x0,		"squiggle2",	"squiggle2",	0x0],
			[0x0,		0x0,		0x0,		0x0],
		],
		[
			[0x0,		"squiggle2",	0x0,		0x0],
			["squiggle2",	"squiggle2",	0x0,		0x0],
			["squiggle2",	0x0,		0x0,		0x0],
			[0x0,		0x0,		0x0,		0x0],
		]
	],
];


// for testing:

// console.log("test Pieces: ");
// let piece = Piece.generateRandomPiece();
// console.log("piece: ", piece);
// piece.rotate();
// console.log("piece: ", piece);
// piece.rotate();
// console.log("piece: ", piece);
// piece.rotate();
// console.log("piece: ", piece);
// piece.move();
// console.log("piece: ", piece);

// let p = new Piece(1);
// console.log("p: ", p);

// module.exports = {
// 	Piece: Piece
// }


export default Piece;

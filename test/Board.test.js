import chai from 'chai'
import { expect } from 'chai'
import Board from '../src/server/classes/Board'
import Piece from '../src/server/classes/Piece'

chai.should()

describe('Board Test', function() {

	let board = null;
	let params = {};

	beforeEach(function() {
		board = new Board(params);
	})

	afterEach(function() {
		// ?
	})

	it('Constructor Test', function() {

		expect(board.removedLines).equal(0);

		for (let y = 0; y < board.size.y; y++) {
			for (let x = 0; x < board.size.x; x++) {
				expect(board.cells[y][x]).equal(0);
			}
		}
	})

	it('Add Piece', function() {

		board.addPieces(null);
		expect(board.piecesList.length).equal(0);
		board.addPieces([new Piece()]);
		expect(board.piecesList.length).equal(1);
	})

	it('setNextActivePiece', function() {
		//1
		board.setNextActivePiece();
		expect(board.activePiece).equal(undefined);
		//2
		let piece = new Piece({type: 0});
		board.addPieces([piece, new Piece({type: 0})]);
		board.setNextActivePiece();
		expect(board.activePiece).equal(piece);
		expect(board.needToBroadcast).equal(true);

		//3
		board.cells[0][5] = 'line';
		board.cells[1][5] = 'line';
		board.setNextActivePiece();
		expect(board.gameOver).equal(true);
	})

	it('tryToRotatePiece', function () {
		let ret = board.tryToRotatePiece(null);
		expect(ret).equal(undefined);

		let piece = new Piece({type: 0});
		ret = board.tryToRotatePiece(piece);
		expect(ret).equal(true);

		board.cells[0][5] = 'line';
		board.cells[1][5] = 'line';
		piece = new Piece({type: 0});
		ret = board.tryToRotatePiece(piece);
		expect(ret).equal(false);
	})

	it('tryToMovePiece', function () {
		let vector = {x: 0, y: 1};
		let ret = board.tryToMovePiece(null);
		expect(ret).equal(undefined);

		let piece = new Piece({type: 0});
		ret = board.tryToMovePiece(piece);
		expect(ret).equal(piece);

		piece = new Piece({type: 0});
		ret = board.tryToMovePiece(piece, vector);
		expect(ret).equal(true);

		board.cells[1][4] = 'line';
		board.cells[2][4] = 'line';
		piece = new Piece({type: 0});
		ret = board.tryToMovePiece(piece, vector);
		expect(ret).equal(false);
	})

	it('rotate no active piece', function () {
		let ret = board.rotate();
		expect(ret).equal(undefined);
	})

	it('rotate not moved', function () {
		let ret = board.rotate();
		board.activePiece = new Piece({type: 0});
		ret = board.rotate();
		expect(ret).equal(true);
	})

	it('rotate left1', function () {
		let ret = board.rotate();
		board.activePiece = new Piece({type: 0, orientation: 1});
		board.cells[2][6] = 'l1';
		ret = board.rotate();
		expect(ret).equal(true);
	})

	it('rotate left2', function () {
		let ret = board.rotate();
		board.activePiece = new Piece({type: 0, orientation: 1});
		board.cells[2][5] = 'l1';
		ret = board.rotate();
		expect(ret).equal(true);
	})

	it('rotate right1', function () {
		let ret = board.rotate();
		board.activePiece = new Piece({type: 0, orientation: 1});
		board.cells[2][3] = 'l1';
		ret = board.rotate();
		expect(ret).equal(true);
	})

	it('rotate right2', function () {
		let ret = board.rotate();
		board.activePiece = new Piece({type: 0, orientation: 1});
		board.cells[2][3] = 'l1';
		board.cells[2][4] = 'l1';
		ret = board.rotate();
		expect(ret).equal(true);
	})

	it('rotate up1', function () {
		let ret = board.rotate();
		board.activePiece = new Piece({type: 0, orientation: 1});
		board.cells[2] = new Array(10).fill(0x1);
		ret = board.rotate();
		expect(ret).equal(true);
	})

	it('rotate up2', function () {
		let ret = board.rotate();
		board.activePiece = new Piece({type: 0, orientation: 1});
		board.cells[1] = new Array(10).fill(0x1);
		board.cells[2] = new Array(10).fill(0x1);
		ret = board.rotate();
		expect(ret).equal(true);
	})

	it('rotate fail', function () {
		let ret = board.rotate();
		board.activePiece = new Piece({type: 0, orientation: 1});
		board.cells[0] = new Array(10).fill(0x1);
		board.cells[1] = new Array(10).fill(0x1);
		board.cells[2] = new Array(10).fill(0x1);
		ret = board.rotate();
		expect(ret).equal(false);
	})

	it('move left no piece', function () {
		board.moveLeft();
	})

	it('move left fail', function () {
		board.activePiece = new Piece({type: 0, orientation: 0});
		board.cells[1][4] = '0x15';
		let ret = board.moveLeft();
		expect(ret).equal(false);
	})

	it('move left success', function () {
		board.activePiece = new Piece({type: 0, orientation: 0});
		let ret = board.moveLeft();
		expect(ret).equal(true);
	})

	it('move right no piece', function () {
		board.moveRight();
	})

	it('move right fail', function () {
		board.activePiece = new Piece({type: 0, orientation: 0});
		board.cells[1][7] = '0x15';
		let ret = board.moveRight();
		expect(ret).equal(false);
	})

	it('move right success', function () {
		board.activePiece = new Piece({type: 0, orientation: 0});
		let ret = board.moveRight();
		expect(ret).equal(true);
	})

	it('move down no piece', function () {
		board.moveDown();
	})

	it('move down fail', function () {
		board.activePiece = new Piece({type: 0, orientation: 0});
		board.cells[2][6] = '0x15';
		let ret = board.moveDown();
		expect(ret).equal(false);
	})

	it('move down success', function () {
		board.activePiece = new Piece({type: 0, orientation: 0});
		let ret = board.moveDown();
		expect(ret).equal(true);
	})

	it('downShortcut no piece', function () {
		board.downShortcut();
	})

	it('downShortcut success', function () {
		board.activePiece = new Piece({type: 0, orientation: 0});
		let ret = board.downShortcut();
		expect(board.cells[19][6]).equal("line");
	})

	it('removeFullLine GameOver', function () {
		board.gameOver = true;
		expect(board.removeFullLine()).equal(undefined);
	})

	it('removeFullLine success', function () {
		board.cells[3] = new Array(10).fill('line');
		board.removeFullLine();
		expect(board.removedLines).to.be.equal(1);
	})

	it('removeFullLine noFullLine', function () {
		board.removeFullLine();
		expect(board.removedLines).to.be.equal(0);
	})

	it('getCells noActivePiece', function () {
		let cells = board.getCells();
		for (let y = 0; y < board.size.y; y++) {
			for (let x = 0; x < board.size.x; x++) {
				expect(cells[y][x]).equal(0x0);
			}
		}
	})

	it('getCells activePiece', function () {
		board.activePiece = new Piece({type: 0, orientation: 0});
		let cells = board.getCells();
		expect(cells[1][5]).equal('line');
	})

	it('getCells activePiece', function () {
		board.cells[0][5] = '0x42';
		let cells = board.getShadowCells();
		expect(cells[19][5]).equal('gameOver');
	})

	it('fillRed', function () {
		board.fillRed();
		for (let y = 0; y < board.size.y; y++) {
			for (let x = 0; x < board.size.x; x++) {
				expect(board.cells[y][x]).equal('gameOver');
			}
		}
	})

})

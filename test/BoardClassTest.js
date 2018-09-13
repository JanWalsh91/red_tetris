import chai from "chai"
import Board from '../src/server/classes/Board'

chai.should()

describe('Board Test', function() {
	it('Constructor Test', function() {
		let board = new Board();

		// console.log(board);

		chai.expect(board.removedLines).to.equals(0);

		for (let y = 0; y < board.size.y; y++) {
			for (let x = 0; x < board.size.x; x++) {
				chai.expect(board.cells[y][x]).to.equals(0);
			}
		}
	})

})

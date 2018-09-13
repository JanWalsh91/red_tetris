import chai from 'chai'
import { expect } from 'chai'
import Game from '../src/server/classes/Game'
import Board from '../src/server/classes/Board'
import Player from '../src/server/classes/Player'

chai.should()

describe('Game Test', function() {

	let game = null;
	let player = null;
	let gameID = undefined;

	beforeEach(function() {
		game = new Game(player, gameID);
	})

	afterEach(function() {
		// ?
	})

	it('Constructor', function() {
		expect(Game.gameCount).equal(1);
	})

	gameID = 789;

	it('Constructor GameID', function() {
		expect(game.id).equal(gameID);
	})

	gameID++;
	player = new Player('Toto');

	it('GameInfo', function () {
		let info = game.getInfo();

		expect(info).deep.equal({id: gameID, hostName: 'Toto', playerCount: 1});
	})

	it('init', function () {
		game.init();
		expect(game.piecesList.length).equal(Game.newPiecesCount);
	})


	it('initPlayerBoard empty player', function () {
		expect(game.initPlayerBoard()).equal(undefined);
	})

	it('initPlayerBoard success', function () {
		game.initPlayerBoard(player);
		expect(!!player.board).equal(true);
	})

	player.score = 2000;

	it('updateGameLevel', function () {
		game.ticFunction = function () {}
		game.updateGameLevel(player.score);
		expect(game.highestScore).equal(2000);
		expect(game.level).equal(1);

		game.updateGameLevel(player.score * 2);
		expect(game.level).equal(3);
	})

	it('gameStart success', function () {
		game.start();
		expect(game.isPlaying).equal(true);
	})

	describe('Board callbacks from Game Test', function() {
		let callbackPlayer = null;

		beforeEach(function() {
			callbackPlayer = new Player('PlayerName', '0123');
			game.initPlayerBoard(callbackPlayer);
		})

		it('getPiecesFromGame', function () {
			callbackPlayer.board.getPiecesFromGame(callbackPlayer.board);
			expect(callbackPlayer.board.piecesList.length).equal(5);
			callbackPlayer.board.getPiecesFromGame(callbackPlayer.board);
			expect(callbackPlayer.board.piecesList.length).equal(5);
		})

		let friend = new Player('Friend', '3210');

		it('updateScoreAndFrozenLinesInGame', function () {
			game.players.push(friend);
			game.initPlayerBoard(friend);
			callbackPlayer.board.updateScoreAndFrozenLinesInGame(2);
			expect(friend.board.frozenLines).equal(1);
			expect(callbackPlayer.score).equal(100);
		})

		it('endGame', function () {
			game.players = [];
			game.players.push(callbackPlayer);
			callbackPlayer.board.gameOver = true;
			callbackPlayer.board.checkForEndGame();
			expect(callbackPlayer.isWinner).equal(1 == 1);
		})
	})
})

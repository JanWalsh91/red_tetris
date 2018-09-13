import chai from 'chai'
import { expect } from 'chai'
import Server from '../src/server/classes/Server'
import Game from '../src/server/classes/Game'
import Board from '../src/server/classes/Board'
import Player from '../src/server/classes/Player'

chai.should()

describe('Server Test', function() {

	let server = null;
	let game = null;
	let player = null;
	let gameID = undefined;


	const app = require('http').createServer();
	const io = require('socket.io')(app)


	after(function () {
		io.close()
		app.close( () => {
			app.unref()
		})
	})

	beforeEach(function() {
		server = new Server(io);
		// game = new Game(player, gameID);
	})


	afterEach(function() {
		// ?
	})

	it('updateHostList', function() {
		expect(Game.gameCount).equal(1);
	})

	gameID = 789;

	it('Constructor GameID', function() {
		expect(game.id).equal(gameID);
	})


})

import chai from 'chai'
import { expect } from 'chai'
import Server from '../src/server/classes/Server'
import Game from '../src/server/classes/Game'
import Board from '../src/server/classes/Board'
import Player from '../src/server/classes/Player'

import ioClient from 'socket.io-client'

chai.should()

describe('Server Test', function() {

	let server = null;
	let game = null;
	let player = null;
	let gameID = undefined;


	let app = require('http').createServer();
	let io = require('socket.io')(app)


	let socketURL = 'http://0.0.0.0:5000';


	let options ={
		transports: ['websocket'],
		'force new connection': true
	};

	// after(function () {
	// 	io.close()
	// 	app.close( () => {
	// 		app.unref()
	// 	})
	// })

	beforeEach(function() {
		server = new Server(io);
		// game = new Game(player, gameID);
	})


	afterEach(function() {
		// ?
	})

	// it('updateHostList', function() {
	//
	// 	let client1 = io.connect(socketURL, options);
	// 	// expect(Game.gameCount).equal(1);
	// })


})

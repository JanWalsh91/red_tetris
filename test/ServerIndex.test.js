import rootReducer from '../src/client/reducers'
import chai from "chai"
import { expect } from 'chai'
// import {startServer, configureStore} from './helpers/server'

import * as server from '../src/server/index'

import io from 'socket.io-client'
import params from '../params'

import * as ActionNames from '../src/server/serverActions'

chai.should()

describe('server test', function(){
	let stop;

	beforeEach( () => {
		server.create( params.server )
			.then( (endServer) => {
				// console.log("create THEN: ", endServer);
				stop = endServer.stop;
			})
	})
	let options = {};

	afterEach( function(done) {
		stop(done);
	});


	it('ADD_NEW_PLAYER_TO_LOBBY, first connection', function(done) {
	 	let client = io.connect(params.server.getUrl(), options);
		let name = "name";

		client.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, name);
		let p1 = new Promise( (resolve, reject) => {
				client.on(ActionNames.UPDATE_PLAYER_UUID, (uuid) => {
				expect(!!uuid).equal(true);
				resolve();
			})
		})
		let p2 = new Promise( (resolve, reject) => {
				client.on(ActionNames.UPDATE_HOST_LIST, (list) => {
				expect(list.length).equal(0);
				resolve();
			})
		})
		Promise.all([p1, p2])
			.then( () => {
				client.disconnect();
				done();
			});
	});

	it('CREATE_GAME check gameJoined', function(done) {
		let client = io.connect(params.server.getUrl(), options);
		client.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name');
		client.emit(ActionNames.CREATE_GAME);

		client.on(ActionNames.UPDATE_GAME_JOINED, ({gameJoined, gameID}) => {
			expect(gameJoined).equal(true);
			expect(gameID).equal(1);
			done();
		});
	});

	it('CREATE_GAME check hostlist', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		let client2 = io.connect(params.server.getUrl(), options);

		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client2.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name2');

		let check = false
		client1.on(ActionNames.UPDATE_GAME_JOINED, () => {
			// console.log("Update uuid");
			check = true;

		})

		client2.on(ActionNames.UPDATE_HOST_LIST, (list) => {
			console.log("UPDATE_HOST_LIST: ", list.length);
			if (check) {
				expect(list.length).equal(1);
				done();
				check = false;
			}
		});

		client1.emit(ActionNames.CREATE_GAME);
	});

	it('JOIN_GAME', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		let client2 = io.connect(params.server.getUrl(), options);
		let client3 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client2.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name2');
		client3.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name3');

		client1.on(ActionNames.UPDATE_PLAYER_UUID, () => {
			client1.emit(ActionNames.CREATE_GAME);
		});

		let check = false;
		client2.on(ActionNames.UPDATE_HOST_LIST, (list) => {
			if (list.length == 1) {
				client2.emit(ActionNames.JOIN_GAME, (1));
				check = true;
			}
		})

		client3.on(ActionNames.UPDATE_HOST_LIST, (list) => {
			// console.log("list: ", list);
			if (check && list[0].playerCount == 2) {
				expect(list[0].playerCount).equal(2);
				check = false;
				done();
			}
		})
	});

	it('UPDATE_GAME_STATE', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ActionNames.CREATE_GAME);

		client1.on(ActionNames.UPDATE_GAME_STATE, gameState => {
			expect(!!gameState).equal(true);
			done();
		});
	});

	it('START_GAME, -> updating game state', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ActionNames.CREATE_GAME);
		client1.emit(ActionNames.START_GAME);
		// game stated if player recieved UPDATE_GAME_START
		client1.on(ActionNames.UPDATE_GAME_START, () => {
			done();
		})
	});

	// TODO: fix
	// playerAction
	it('SEND_GAME_ACTION, downShortcut', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ActionNames.CREATE_GAME);
		client1.emit(ActionNames.START_GAME);
		client1.emit(ActionNames.SEND_GAME_ACTION, "downShortcut");

		let check = true;
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			let newPiece = server.server.players.get(client1.id).board.activePiece;
			// console.log("oldPiece coords: ", activePiece.coords);
			console.log("newPiece coords: ", newPiece.coords);
			if (newPiece.coords.y = 19) {
				if (check) {
					done();
					check = false;
				}
			}
		})
	});


	it('SEND_GAME_ACTION, left', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ActionNames.CREATE_GAME);
		client1.emit(ActionNames.START_GAME);

		let activePiece = undefined;
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			if (!activePiece) {
				activePiece = server.server.players.get(client1.id).board.activePiece;
				client1.emit(ActionNames.SEND_GAME_ACTION, "left");
				return ;
			}
			let newPiece = server.server.players.get(client1.id).board.activePiece;
			if (newPiece.coords.x - activePiece.coords.x == -1) {
				done();
			}
		})
	});


	it('SEND_GAME_ACTION, rotate', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ActionNames.CREATE_GAME);
		client1.emit(ActionNames.START_GAME);

		let activePiece = undefined;
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			if (!activePiece) {
				activePiece = server.server.players.get(client1.id).board.activePiece;
				client1.emit(ActionNames.SEND_GAME_ACTION, "rotate");
				return ;
			}
			let newPiece = server.server.players.get(client1.id).board.activePiece;
			// console.log("newPiece orientation: ", newPiece.orientation);
			// console.log("activePiece orientation: ", activePiece.orientation);
			if (activePiece.orientation == 0 && newPiece.orientation == 1) {
				done();
			}
		})
	});

	it('SEND_GAME_ACTION, right', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ActionNames.CREATE_GAME);
		client1.emit(ActionNames.START_GAME);

		let activePiece = undefined;
		let check = true;
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			if (!activePiece) {
				activePiece = server.server.players.get(client1.id).board.activePiece;
				client1.emit(ActionNames.SEND_GAME_ACTION, "right");
				return ;
			}
			let newPiece = server.server.players.get(client1.id).board.activePiece;
			if (newPiece.coords.x - activePiece.coords.x == 1) {
				if (check) {
					done();
					check = false;
				}
			}
		})
	});

	it('SEND_GAME_ACTION, down', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ActionNames.CREATE_GAME);
		client1.emit(ActionNames.START_GAME);

		let activePiece = undefined;
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			if (!activePiece) {
				activePiece = server.server.players.get(client1.id).board.activePiece;
				client1.emit(ActionNames.SEND_GAME_ACTION, "down");
				return ;
			}
			let newPiece = server.server.players.get(client1.id).board.activePiece;
			if (newPiece.coords.y - activePiece.coords.y == 1) {
				done();
			}
		})
	});

	it('SEND_GAME_ACTION, invalid action', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ActionNames.CREATE_GAME);
		client1.emit(ActionNames.START_GAME);

		let activePiece = undefined;
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			if (!activePiece) {
				activePiece = server.server.players.get(client1.id).board.activePiece;
				client1.emit(ActionNames.SEND_GAME_ACTION, "invalid");
				return ;
			}
			let newPiece = server.server.players.get(client1.id).board.activePiece;
			if (newPiece.coords.y == activePiece.coords.y &&
			newPiece.coords.x == activePiece.coords.x) {
				done();
			}
		})
	});

	// TODO: not working
	// player DISCONNECT delete game
	// it('DISCONNECT, delete game', function(done) {
	// 	let client1 = io.connect(params.server.getUrl(), options);
	// 	// let client2 = io.connect(params.server.getUrl(), options);
	// 	client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
	// 	client1.emit(ActionNames.CREATE_GAME);
	//
	// 	client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
	// 		client1.disconnect();
	// 	});
	// 	client1.on(ActionNames.DISCONNECT, () => {
	// 		console.log("you disconnected");
	// 		done();
	// 	});
	// });

	it('DISCONNECT, update game host', function (done) {
		let client1 = io.connect(params.server.getUrl(), options);
		let client2 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client2.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name2');
		// player 1 create game
		client1.emit(ActionNames.CREATE_GAME);
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			// console.log("got update game state");
			// let g = server.server.games.get(client1.id);
			// console.log("game1 players length: ", g.players.length);
			if (gameState) {
				// console.log("client 2 joining game");
				// when player2 gets game infom disconnect player 1
				client2.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
					// let g = server.server.games.get(client1.id);
					// console.log("game2 players length: ", g.players.length);
					client1.disconnect();
				})
				// when created have player 2 join
				client2.emit(ActionNames.JOIN_GAME, 1);
			}
		})
		client2.on(ActionNames.UPDATE_HOST_STATUS, () => {
			done();
		})
	});

	// TODO:
	// writeBestScore

	it('onURLJOIN', function (done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.UPDATE_REQUEST_URL, {gameID: 1, playerName: 'Josephine'});
		client1.on(ActionNames.UPDATE_HOST_STATUS, () => {
			done();
		});
	});

	// update Shadow board
	it('update shadowBoard', function (done) {
		let client1 = io.connect(params.server.getUrl(), options);
		let client2 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client2.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name2');
		client1.emit(ActionNames.CREATE_GAME);
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			client2.emit(ActionNames.JOIN_GAME, 1);
		});
		let check = true;
		client1.on(ActionNames.UPDATE_SHADOW_STATE, (shadowCellData) => {
			if (check)
				done();
			check = false;
		});
	});

});

import rootReducer from '../src/client/reducers'
import chai from "chai"
import { expect } from 'chai'

import * as server from '../src/server/index'

import io from 'socket.io-client'
import params from '../params'

import * as ActionNames from '../src/server/serverActions'
import * as ServerActions from '../src/client/actions/server'

chai.should()

describe('server test', function(){
	let stop;

	beforeEach( () => {
		server.create( params.server )
			.then( (endServer) => {
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

		client.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, name);
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
		client.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name');
		client.emit(ServerActions.SERVER_CREATE_GAME);

		client.on(ActionNames.UPDATE_GAME_JOINED, ({gameJoined, gameID}) => {
			expect(gameJoined).equal(true);
			expect(gameID).equal(1);
			done();
		});
	});

	it('CREATE_GAME check hostlist', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		let client2 = io.connect(params.server.getUrl(), options);

		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client2.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name2');

		let check = false
		client1.on(ActionNames.UPDATE_GAME_JOINED, () => {
			check = true;
		})

		client2.on(ActionNames.UPDATE_HOST_LIST, (list) => {
			if (check) {
				expect(list.length).equal(1);
				done();
				check = false;
			}
		});

		client1.emit(ServerActions.SERVER_CREATE_GAME);
	});

	it('JOIN_GAME', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		let client2 = io.connect(params.server.getUrl(), options);
		let client3 = io.connect(params.server.getUrl(), options);
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client2.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name2');
		client3.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name3');

		client1.on(ActionNames.UPDATE_PLAYER_UUID, () => {
			client1.emit(ServerActions.SERVER_CREATE_GAME);
		});

		let check = false;
		client2.on(ActionNames.UPDATE_HOST_LIST, (list) => {
			if (list.length == 1) {
				client2.emit(ServerActions.SERVER_JOIN_GAME, (1));
				check = true;
			}
		})

		client3.on(ActionNames.UPDATE_HOST_LIST, (list) => {
			if (check && list[0].playerCount == 2) {
				expect(list[0].playerCount).equal(2);
				check = false;
				done();
			}
		})
	});

	it('UPDATE_GAME_STATE', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ServerActions.SERVER_CREATE_GAME);

		client1.on(ActionNames.UPDATE_GAME_STATE, gameState => {
			expect(!!gameState).equal(true);
			done();
		});
	});

	it('START_GAME, -> updating game state', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ServerActions.SERVER_CREATE_GAME);
		client1.emit(ServerActions.SERVER_START_GAME);
		client1.on(ActionNames.UPDATE_GAME_START, () => {
			done();
		})
	});

	it('SEND_GAME_ACTION, downShortcut', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ServerActions.SERVER_CREATE_GAME);
		client1.emit(ServerActions.SERVER_START_GAME);

		let check = true;
		let emitted = false;
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			if (!emitted) {
				client1.emit(ServerActions.SERVER_GAME_ACTION, "downShortcut");
				emitted = true;
			}
			let newPiece = server.server.players.get(client1.id).board.activePiece;
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
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ServerActions.SERVER_CREATE_GAME);
		client1.emit(ServerActions.SERVER_START_GAME);

		let activePiece = undefined;
		let check = true;
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			if (!activePiece) {
				activePiece = server.server.players.get(client1.id).board.activePiece;
				client1.emit(ServerActions.SERVER_GAME_ACTION, "left");
				return ;
			}
			let newPiece = server.server.players.get(client1.id).board.activePiece;
			if (newPiece.coords.x - activePiece.coords.x == -1) {
				if (check) {
					done();
					check = false;
				}
			}
		})
	});

	it('SEND_GAME_ACTION, rotate', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ServerActions.SERVER_CREATE_GAME);
		client1.emit(ServerActions.SERVER_START_GAME);

		let activePiece = undefined;
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			if (!activePiece) {
				activePiece = server.server.players.get(client1.id).board.activePiece;
				client1.emit(ServerActions.SERVER_GAME_ACTION, "rotate");
				return ;
			}
			let newPiece = server.server.players.get(client1.id).board.activePiece;
			if (activePiece.orientation == 0 && newPiece.orientation == 1) {
				done();
			}
		})
	});

	it('SEND_GAME_ACTION, right', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ServerActions.SERVER_CREATE_GAME);
		client1.emit(ServerActions.SERVER_START_GAME);

		let activePiece = undefined;
		let check = true;
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			if (!activePiece) {
				activePiece = server.server.players.get(client1.id).board.activePiece;
				client1.emit(ServerActions.SERVER_GAME_ACTION, "right");
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
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ServerActions.SERVER_CREATE_GAME);
		client1.emit(ServerActions.SERVER_START_GAME);

		let activePiece = undefined;
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			if (!activePiece) {
				activePiece = server.server.players.get(client1.id).board.activePiece;
				client1.emit(ServerActions.SERVER_GAME_ACTION, "down");
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
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ServerActions.SERVER_CREATE_GAME);
		client1.emit(ServerActions.SERVER_START_GAME);

		let activePiece = undefined;
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			if (!activePiece) {
				activePiece = server.server.players.get(client1.id).board.activePiece;
				client1.emit(ServerActions.SERVER_GAME_ACTION, "invalid");
				return ;
			}
			let newPiece = server.server.players.get(client1.id).board.activePiece;
			if (newPiece.coords.y == activePiece.coords.y &&
			newPiece.coords.x == activePiece.coords.x) {
				done();
			}
		})
	});

	it('DISCONNECT, delete game', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ServerActions.SERVER_CREATE_GAME);

		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			client1.disconnect();
		});
		client1.on(ActionNames.DISCONNECT, () => {
			done();
		});
	});

	it('DISCONNECT, update game host', function (done) {
		let client1 = io.connect(params.server.getUrl(), options);
		let client2 = io.connect(params.server.getUrl(), options);
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client2.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name2');
		client1.emit(ServerActions.SERVER_CREATE_GAME);
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			if (gameState) {
				client2.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
					client1.disconnect();
				})
				client2.emit(ServerActions.SERVER_JOIN_GAME, 1);
			}
		})
		client2.on(ActionNames.UPDATE_HOST_STATUS, () => {
			done();
		})
	});

	it('onURLJOIN', function (done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ServerActions.SERVER_UPDATE_REQUEST_URL, {gameID: 1, playerName: 'Josephine'});
		client1.on(ActionNames.UPDATE_HOST_STATUS, () => {
			done();
		});
	});

	it('update shadowBoard', function (done) {
		let client1 = io.connect(params.server.getUrl(), options);
		let client2 = io.connect(params.server.getUrl(), options);
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client2.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name2');
		client1.emit(ServerActions.SERVER_CREATE_GAME);
		client1.on(ActionNames.UPDATE_GAME_STATE, (gameState) => {
			client2.emit(ServerActions.SERVER_JOIN_GAME, 1);
		});
		let check = true;
		client1.on(ActionNames.UPDATE_SHADOW_STATE, (shadowCellData) => {
			if (check)
				done();
			check = false;
		});
	});

	it('set invisible mode', function (done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ServerActions.SERVER_CREATE_GAME);
		client1.emit(ServerActions.SERVER_UPDATE_INVISIBLE_MODE, true);
		done();
	})
});

import rootReducer from '../src/client/reducers'
import chai from "chai"
import { expect } from 'chai'
// import {startServer, configureStore} from './helpers/server'

import * as server from '../src/server/index'

import {pingServer} from '../src/client/actions/server'
import io from 'socket.io-client'
import params from '../params'

import * as ActionNames from '../src/server/serverActions'

chai.should()

describe('Fake server test', function(){
	let stop;


	// before(cb => startServer( params.server, function(err, server) {
	// 	tetrisServer = server
	// 	cb()
	// }))

	beforeEach( () => {
		server.create( params.server )
			.then( (endServer) => {
				console.log("create THEN: ", endServer);
				stop = endServer.stop;
			})
	})

	// let options = {
	//   transports: ['websocket'],
	//   'force new connection': true
	// };

	let options = {};

	afterEach( function(done) {
		stop(done);
	});


	// it('ADD_NEW_PLAYER_TO_LOBBY, first connection', function(done) {
	//  	let client = io.connect(params.server.getUrl(), options);
	// 	let name = "name";
	//
	// 	client.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, name);
	// 	let p1 = new Promise( (resolve, reject) => {
	// 			client.on(ActionNames.UPDATE_PLAYER_UUID, (uuid) => {
	// 			expect(!!uuid).equal(true);
	// 			resolve();
	// 		})
	// 	})
	// 	let p2 = new Promise( (resolve, reject) => {
	// 			client.on(ActionNames.UPDATE_HOST_LIST, (list) => {
	// 			expect(list.length).equal(0);
	// 			resolve();
	// 		})
	// 	})
	// 	Promise.all([p1, p2])
	// 		.then( () => {
	// 			client.disconnect();
	// 			done();
	// 		});
	// });
	//
	// it('CREATE_GAME check gameJoined', function(done) {
	// 	let client = io.connect(params.server.getUrl(), options);
	// 	client.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name');
	// 	client.emit(ActionNames.CREATE_GAME);
	//
	// 	client.on(ActionNames.UPDATE_GAME_JOINED, ({gameJoined, gameID}) => {
	// 		expect(gameJoined).equal(true);
	// 		expect(gameID).equal(1);
	// 		done();
	// 	});
	// });
	//
	// it('CREATE_GAME check hostlist', function(done) {
	// 	let client1 = io.connect(params.server.getUrl(), options);
	// 	let client2 = io.connect(params.server.getUrl(), options);
	//
	// 	client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
	// 	client2.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name2');
	//
	// 	let check = false
	// 	client1.on(ActionNames.UPDATE_GAME_JOINED, () => {
	// 		console.log("Update uuid");
	// 		check = true;
	//
	// 	})
	//
	// 	client2.on(ActionNames.UPDATE_HOST_LIST, (list) => {
	// 		console.log("UPDATE_HOST_LIST: ", list.length);
	// 		if (check) {
	// 			expect(list.length).equal(1);
	// 			done();
	// 			check = false;
	// 		}
	// 	});
	//
	// 	client1.emit(ActionNames.CREATE_GAME);
	// });

	// it('JOIN_GAME', function(done) {
	// 	let client1 = io.connect(params.server.getUrl(), options);
	// 	let client2 = io.connect(params.server.getUrl(), options);
	// 	let client3 = io.connect(params.server.getUrl(), options);
	// 	client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
	// 	client2.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name2');
	// 	client3.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name3');
	//
	// 	client1.on(ActionNames.UPDATE_PLAYER_UUID, () => {
	// 		client1.emit(ActionNames.CREATE_GAME);
	// 	});
	//
	// 	let check = false;
	// 	client2.on(ActionNames.UPDATE_HOST_LIST, (list) => {
	// 		if (list.length == 1) {
	// 			client2.emit(ActionNames.JOIN_GAME, (1));
	// 			check = true;
	// 		}
	// 	})
	//
	// 	client3.on(ActionNames.UPDATE_HOST_LIST, (list) => {
	// 		console.log("list: ", list);
	// 		if (check && list[0].playerCount == 2) {
	// 			expect(list[0].playerCount).equal(2);
	// 			check = false;
	// 			done();
	// 		}
	// 	})
	// });

	it('UPDATE_GAME_STATE', function(done) {
		let client1 = io.connect(params.server.getUrl(), options);
		client1.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, 'name1');
		client1.emit(ActionNames.CREATE_GAME);

		client1.on(ActionNames.UPDATE_GAME_STATE, gameState => {
			expect(!!gameState).equal(true);
			done();
		});
	});

});

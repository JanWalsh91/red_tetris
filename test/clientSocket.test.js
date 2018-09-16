import rootReducer from '../src/client/reducers'
import chai from "chai"
import { expect } from 'chai'
// import {startServer, configureStore} from './helpers/server'

import * as server from '../src/server/index'

import client from '../src/client/socket'
import params from '../params'

import * as ActionNames from '../src/server/serverActions'

chai.should()

describe('server test', function(){
	let stop;

	let serverIO = undefined;

	before( () => {
		return new Promise((fn) => {
			server.create( params.server )
			.then( (endServer) => {
				// console.log("create THEN: ", endServer);
				// console.log(server.server.io);
				serverIO = server.server.io;
				stop = endServer.stop;
				client.connect(params.server.getUrl());
				fn();
			})
		})
	})
	let options = {};

	after( function(done) {
		stop(done);
	});

	it('UPDATE_HOST_LIST', function(done) {
		// console.log(serverIO);

		// console.log(client.id);
		// client.connect(params.server.getUrl());

		//
		// console.log("clientID: ", client.id);

		serverIO.to(client.id).emit(ActionNames.UPDATE_HOST_LIST, 'hostList');
		// serverIO.to(client.id).emit(ActionNames.UPDATE_GAME_JOINED, 'hostList');
		// serverIO.to(client.id).emit(ActionNames.UPDATE_GAME_START, 'hostList');
		// serverIO.to(client.id).emit(ActionNames.UPDATE_GAME_STATE, 'hostList');
		// serverIO.to(client.id).emit(ActionNames.UPDATE_SHADOW_STATE, 'hostList');
		// serverIO.to(client.id).emit(ActionNames.UPDATE_HOST_STATUS, 'hostList');
		// serverIO.to(client.id).emit(ActionNames.UPDATE_PLAYER_UUID, 'hostList');
		// serverIO.to(client.id).emit(ActionNames.UPDATE_PLAYER_NAME, 'hostList');
		// serverIO.to(client.id).emit(ActionNames.IS_WINNER);
		// serverIO.to(client.id).emit(ActionNames.END_GAME, 'hostList');
		done();

	});

	it('UPDATE_GAME_JOINED', function(done) {
		// client.connect(params.server.getUrl());
		serverIO.to(client.id).emit(ActionNames.UPDATE_GAME_JOINED, {gameID: 1});
		done();
	});

	it('UPDATE_GAME_START', function(done) {
		// client.connect(params.server.getUrl());
		serverIO.to(client.id).emit(ActionNames.UPDATE_GAME_START);
		done();
	});

	it('UPDATE_GAME_STATE', function(done) {
		// client.connect(params.server.getUrl());
		serverIO.to(client.id).emit(ActionNames.UPDATE_GAME_STATE, {});
		done();
	});

	it('UPDATE_SHADOW_STATE', function(done) {
		// client.connect(params.server.getUrl());
		serverIO.to(client.id).emit(ActionNames.UPDATE_SHADOW_STATE, {});
		done();
	});

	it('UPDATE_HOST_STATUS', function(done) {
		// client.connect(params.server.getUrl());
		serverIO.to(client.id).emit(ActionNames.UPDATE_HOST_STATUS, true);
		done();
	});

	it('UPDATE_PLAYER_UUID', function(done) {
		// client.connect(params.server.getUrl());
		serverIO.to(client.id).emit(ActionNames.UPDATE_PLAYER_UUID, 123456789);
		done();
	});

	it('UPDATE_PLAYER_NAME', function(done) {
		// client.connect(params.server.getUrl());
		serverIO.to(client.id).emit(ActionNames.UPDATE_PLAYER_NAME, "Name");
		done();
	});

	it('IS_WINNER', function(done) {
		// client.connect(params.server.getUrl());
		serverIO.to(client.id).emit(ActionNames.IS_WINNER);
		done();
	});

	it('IS_WINNER_BY_SCORE', function(done) {
		serverIO.to(client.id).emit(ActionNames.IS_WINNER_BY_SCORE);
		done();
	})

	it('END_GAME', function(done) {
		serverIO.to(client.id).emit(ActionNames.END_GAME);
		done();
	})

	it('UPDATE_LEADER_BOARD', function(done) {
		serverIO.to(client.id).emit(ActionNames.UPDATE_LEADER_BOARD, {});
		done();
	})

	it('SEND_ERROR_STATUS', function(done) {
		serverIO.to(client.id).emit(ActionNames.UPDATE_LEADER_BOARD);
		done();
	})
})

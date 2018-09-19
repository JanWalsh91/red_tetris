import params from '../params'
import io from 'socket.io-client'
import reducer from '../src/client/reducers'
import initialState from '../src/client/initialState'
import { createStore, applyMiddleware, compose } from 'redux'
import * as server from '../src/server/index'
import {storeStateMiddleWare} from '../src/client/middleware/storeStateMiddleWare'
import * as ActionNames from '../src/server/serverActions'

import { expect, assert } from 'chai'

describe('Store MiddleWare', function () {

	let stop;
	let serverIO = undefined;
	let client = null;
	let store = null;

	before( () => {
		this.timeout(3000);
		return new Promise((fn) => {
			server.create( params.server )
			.then( (endServer) => {
				serverIO = server.server.io;
				stop = endServer.stop;
				client = io.connect(params.server.getUrl());
				store = createStore(reducer, initialState, compose(
					applyMiddleware(
						storeStateMiddleWare(client)
					)
				))
				client.on('connect', fn)
			})
		})
	})

	after( function(done) {
		client.disconnect();
		stop(done);
	});

	it ('isWinner', function(done) {
		serverIO.to(client.id).emit('IS_WINNER');
		client.on('IS_WINNER', function () {
			expect(store.getState().isWinner).to.be.true;
			done();
		})
	});

	it ('endGame', function(done) {
		serverIO.to(client.id).emit('END_GAME', []);
		client.on('END_GAME', function () {
			expect(store.getState().playersLostList).deep.equal([]);
			done();
		})
	});

	it ('gameStart', function(done) {
		serverIO.to(client.id).emit('UPDATE_GAME_START');
		client.on('UPDATE_GAME_START', function () {
			expect(store.getState().gameStart).to.be.true;
			done();
		})
	});

});

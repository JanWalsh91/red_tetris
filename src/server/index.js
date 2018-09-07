import fs  from 'fs'
import debug from 'debug'
import Server from './classes/Server'
import Player from './classes/Player'

import * as ActionNames from './serverActions'

const server = new Server();

const logerror = debug('tetris:error')
, loginfo = debug('tetris:info')

const initApp = (app, params, cb) => {
	const {host, port} = params
	const handler = (req, res) => {
		const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html'
		fs.readFile(__dirname + file, (err, data) => {
			if (err) {
				logerror(err)
				res.writeHead(500)
				return res.end('Error loading index.html')
			}
			res.writeHead(200)
			res.end(data)
		})
	}

	app.on('request', handler)

	app.listen({host, port}, () => {
		loginfo(`tetris listen on ${params.url}`)
		cb()
	})
}

const initEngine = io => {
	/*
	*	Emits an updated list of available games to all sockets joined to 'lobby'
	*/
	const updateHostList = () => {
		io.to('lobby').emit(ActionNames.UPDATE_HOST_LIST, server.getJoinableGames());
	}

	/*
	*	For a player, send its gameState to him
	*/
	const updateGameState = (player) => {
		console.log("[index.js] updateGameState");
		// get socket of player
		let socket = server.sockets.get(player.socketID);
		socket.emit(ActionNames.UPDATE_GAME_STATE, player.board.getCells());
	}

	/*
	*	For a player, sends its shadowGameState to all players in that game
	*/
	// TODO:
	const updateShadowGameState = () => {

	}


	io.on(ActionNames.CONNECTION, function(socket) {
		console.log("[server/index.js] ", ActionNames.CONNECTION);
		loginfo("Socket connected: " + socket.id)
		// updateHostList();
		server.sockets.set(socket.id, socket);

		/*
		*	Emitted when client updates name in GUI
		*/
		socket.on(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, (playerName) => {
			console.log("[server/index.js] ", "Adding", playerName, "to lobby");
			let player = new Player(playerName, socket.id);
			server.lobby.set(socket.id, player);
			socket.join('lobby');
			updateHostList();
		})

		socket.on(ActionNames.JOIN_GAME, (gameID) => {
			console.log("[server/index.js] ", ActionNames.JOIN_GAME, gameID);
			// TODO: move player from lobby list to game's player list

			let player = server.lobby.get(socket.id);

			console.log("got player: ", player);
			// server.printGames();

			// TODO: handle errors
			server.joinGame(player, gameID);
			server.lobby.delete(socket.id);
			socket.leave('lobby');
			socket.join(gameID);
			updateHostList();

			socket.emit(ActionNames.UPDATE_GAME_JOINED, true);
			// server.printGames();
		})

		socket.on(ActionNames.CREATE_GAME, () => {
			console.log("[server/index.js] ", ActionNames.CREATE_GAME);
			let player = server.lobby.get(socket.id);
			// TODO: get player from lobby list
			// console.log(p);

			// Create a new Game, the player is now the host
			let game = server.createNewGame(player);

			// Remove the player from the lobby map and send the new server info to the lobby
			server.lobby.delete(socket.id);
			socket.join(game.id);
			updateHostList();

			socket.emit(ActionNames.UPDATE_GAME_JOINED, true);
			updateGameState(player);
		})

		socket.on(ActionNames.DISCONNECT, function() {
			console.log("[server/index.js] ", ActionNames.DISCONNECT, socket.id);
			let x = {}
			server.games.find( g => {
				let player = g.players.find( p => p.socketID === socket.id );
				if (player !== undefined) {
					x = {player, g};
					return true;
				}
			})
			console.log(x);
			if (x.player !== undefined) {
				server.removePlayerFromGame(x.player, x.g);
				let serverInfo = server.getJoinableGames();
				io.to('lobby').emit(ActionNames.UPDATE_HOST_LIST, serverInfo);
			}
		})

		socket.on('action', (action) => {
			console.log(action);
			console.log(action.type);

			if (action.type === 'server/ping') {
				console.log("responding");
				socket.emit('action', {type: 'pong'})
			}
		})
	})

}

export function create(params) {
	const promise = new Promise( (resolve, reject) => {
		const app = require('http').createServer()
		initApp(app, params, () => {
			const io = require('socket.io')(app)
			const stop = (cb) => {
				io.close()
				app.close( () => {
					app.unref()
				})
				loginfo(`Engine stopped.`)
				cb()
			}

			initEngine(io)
			resolve({stop})
		})
	})
	return promise
}

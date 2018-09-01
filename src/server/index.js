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
	io.on(ActionNames.CONNECTION, function(socket) {
		console.log(ActionNames.CONNECTION);
		loginfo("Socket connected: " + socket.id)
		let serverInfo = server.getJoinableGames();
		console.log("server info: ");
		console.dir(serverInfo);
		// socket.emit('serverInfo', serverInfo);

		// io.to('lobby').emit('serverInfo', serverInfo);

		socket.on(ActionNames.NEW_PLAYER, (playerName) => {
			console.log("Adding", playerName, "to lobby");
			let player = new Player(playerName, socket.id);
			server.pendingPlayers.set(socket.id, player);
			socket.join('lobby');
			io.to('lobby').emit(ActionNames.SERVER_INFO, serverInfo);
		})

		socket.on(ActionNames.JOIN_GAME, (action) => {
			console.log(ActionNames.JOIN_GAME, action);
			// TODO: move player from lobby list to game's player list

			let p = server.pendingPlayers.get(socket.id);

			console.log("got player: ", p);
			// server.printGames();

			// TODO: handle errors
			server.onJoinGame(p, action);
			server.pendingPlayers.delete(socket.id);
			let serverInfo = server.getJoinableGames();
			// console.log("joinableGames: ", serverInfo);
			io.to('lobby').emit(ActionNames.SERVER_INFO, serverInfo);

			socket.emit(ActionNames.GAME_JOINED);
			// server.printGames();
		})

		socket.on(ActionNames.CREATE_GAME, () => {
			console.log(ActionNames.CREATE_GAME);
			// TODO: get player from lobby list
			let p = server.pendingPlayers.get(socket.id);
			// console.log(p);

			// Create a new Game, the player is now the host
			server.onCreateNewGame(p);

			// Remove the player from the pendingPlayers map and send the new server info to the lobby
			server.pendingPlayers.delete(socket.id);
			let serverInfo = server.getJoinableGames();
			io.to('lobby').emit(ActionNames.SERVER_INFO, serverInfo);

			socket.emit(ActionNames.GAME_JOINED);
		})

		socket.on('action', (action) => {
			console.log(action);
			console.log(action.type);

			if (action.type === 'server/ping') {
				console.log("responding");
				socket.emit('action', {type: 'pong'})
			}
		})

		socket.on(ActionNames.DISCONNECT, function() {
			console.log(ActionNames.DISCONNECT, socket.id);
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
				io.to('lobby').emit(ActionNames.SERVER_INFO, serverInfo);
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

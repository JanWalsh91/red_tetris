import fs  from 'fs'
import debug from 'debug'
import Server from './classes/Server'
import Player from './classes/Player'

import * as ActionNames from './serverActions'

/*
*	index.js handles socket io initialization and callbacks
*/

const logerror = debug('tetris:error'), loginfo = debug('tetris:info')

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

export const server = new Server();

const initEngine = io => {
	server.io = io;
	io.on(ActionNames.CONNECTION, function(socket) {
		console.log("[server/index.js] ", ActionNames.CONNECTION, ": ", socket.id);

		server.sendBestScore(socket);
		// console.log(socket.request.headers);
		// loginfo("Socket connected: " + socket.id)



		socket.on(ActionNames.UPDATE_REQUEST_URL, (data) => {
			server.onURLJoin(socket, data);
		})

		/*
		*	Emitted when client updates name in GUI
		*/
		socket.on(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, (playerName) => {
			console.log("[server/index.js] ", "Adding", playerName, "to lobby");
			server.addNewPlayerToLobby(socket, playerName);
		})

		socket.on(ActionNames.JOIN_GAME, (gameID) => {
			server.joinGame(socket, gameID);
		})

		socket.on(ActionNames.CREATE_GAME, () => {
			server.createGame(socket);
		})

		socket.on(ActionNames.START_GAME, () => {
			server.startGame(socket);
		})

		socket.on(ActionNames.SEND_GAME_ACTION, (action) => {
			server.playerAction(socket, action);
		})

		socket.on(ActionNames.DISCONNECT, () => {
			console.log("[Server/index.js] DISCONNECT");
			server.playerDisconnect(socket);
		})

		socket.on(ActionNames.QUIT_GAME, () => {
			let playerName = server.players.get(socket.id).name;
			server.playerDisconnect(socket);
			server.addNewPlayerToLobby(socket, playerName);
		})
	})
}

export function create(params) {
	const promise = new Promise( (resolve, reject) => {
		const app = require('http').createServer();
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

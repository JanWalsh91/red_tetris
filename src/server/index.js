import fs  from 'fs'
import debug from 'debug'
import Server from './classes/Server'
import Player from './classes/Player'

import * as ActionNames from './serverActions'

import * as ClientActions from '../client/actions/server'

/*
*	index.js handles socket io initialization and callbacks
*/

const logerror = debug('tetris:error'), loginfo = debug('tetris:info')

const initApp = (app, params, cb) => {

	const {host, port} = params
	const handler = (req, res) => {
		let file = '';
		switch (req.url) {
			case '/public/index.css':
				file = __dirname + '/../../public/index.css';
				break;
			case '/public/mainTheme.mp3':
				file = __dirname + '/../../public/mainTheme.mp3';
				break;
			default:
				file = __dirname + (req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html');
		}
		fs.readFile(file, (err, data) => {
			if (err) {
				logerror(err)
				res.writeHead(500)
				return res.end('Error loading resource')
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
		server.sendBestScore(socket);

		socket.on(ClientActions.SERVER_UPDATE_REQUEST_URL, (data) => {
			server.onURLJoin(socket, data);
		})

		/*
		*	Emitted when client updates name in GUI
		*/
		socket.on(ClientActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, (playerName) => {
			server.addNewPlayerToLobby(socket, playerName);
		})

		socket.on(ClientActions.SERVER_JOIN_GAME, (gameID) => {
			server.joinGame(socket, gameID);
		})

		socket.on(ClientActions.SERVER_CREATE_GAME, () => {
			server.createGame(socket);
		})

		socket.on(ClientActions.SERVER_START_GAME, () => {
			server.startGame(socket);
		})

		socket.on(ClientActions.SERVER_GAME_ACTION, (action) => {
			server.playerAction(socket, action);
		})

		socket.on(ActionNames.DISCONNECT, () => {
			server.playerDisconnect(socket);
		})

		socket.on(ClientActions.SERVER_QUIT_GAME, () => {
			let playerName = server.players.get(socket.id).name;
			server.playerDisconnect(socket)
				.then(() => server.addNewPlayerToLobby(socket, playerName));
		})

		socket.on(ClientActions.SERVER_UPDATE_INVISIBLE_MODE, (action) => {
			server.setInvisibleMode(socket, action);
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

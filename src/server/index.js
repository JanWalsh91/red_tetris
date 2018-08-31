import fs  from 'fs'
import debug from 'debug'
import Server from './classes/Server'
import Player from './classes/Player'

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
	io.on('connection', function(socket) {

		socket.join('lobby');

		loginfo("Socket connected: " + socket.id)
		let serverInfo = server.getJoinableGames();
		console.log("server info: ");
		console.dir(serverInfo);
		// socket.emit('serverInfo', serverInfo);
		io.to('lobby').emit('serverInfo', serverInfo);

		socket.on('selectGame', (action) => {



			let p = new Player(action.playerName, socket.id);

			// server.printGames();

			// console.log(action.hostID);
			if (action.hostID != undefined)
				server.onSelectGame(p, action.hostID);
			else
				server.onCreateNewGame(p);

			let serverInfo = server.getJoinableGames();
			io.to('lobby').emit('serverInfo', serverInfo);
			// socket.emit('serverInfo', serverInfo);

			// server.printGames();
		})

		socket.on('action', (action) => {

			console.log(action);
			console.log(action.type);

			if (action.type === 'server/ping') {
				console.log("responding");
				socket.emit('action', {type: 'pong'})
			}
		})

		socket.on('disconnect', function() {
			console.log(socket.id);
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
				io.to('lobby').emit('serverInfo', serverInfo);
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

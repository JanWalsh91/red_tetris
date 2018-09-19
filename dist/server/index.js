'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.server = undefined;
exports.create = create;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _Server = require('./classes/Server');

var _Server2 = _interopRequireDefault(_Server);

var _Player = require('./classes/Player');

var _Player2 = _interopRequireDefault(_Player);

var _serverActions = require('./serverActions');

var ActionNames = _interopRequireWildcard(_serverActions);

var _server = require('../client/actions/server');

var ClientActions = _interopRequireWildcard(_server);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
*	index.js handles socket io initialization and callbacks
*/

var logerror = (0, _debug2.default)('tetris:error'),
    loginfo = (0, _debug2.default)('tetris:info');

var initApp = function initApp(app, params, cb) {
	var host = params.host,
	    port = params.port;

	var handler = function handler(req, res) {
		var file = '';
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
		_fs2.default.readFile(file, function (err, data) {
			if (err) {
				logerror(err);
				res.writeHead(500);
				return res.end('Error loading resource');
			}
			res.writeHead(200);
			res.end(data);
		});
	};

	app.on('request', handler);

	app.listen({ host: host, port: port }, function () {
		loginfo('tetris listen on ' + params.url);
		cb();
	});
};

var server = exports.server = new _Server2.default();

var initEngine = function initEngine(io) {
	server.io = io;
	io.on(ActionNames.CONNECTION, function (socket) {
		server.sendBestScore(socket);

		socket.on(ClientActions.SERVER_UPDATE_REQUEST_URL, function (data) {
			server.onURLJoin(socket, data);
		});

		/*
  *	Emitted when client updates name in GUI
  */
		socket.on(ClientActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, function (playerName) {
			server.addNewPlayerToLobby(socket, playerName);
		});

		socket.on(ClientActions.SERVER_JOIN_GAME, function (gameID) {
			server.joinGame(socket, gameID);
		});

		socket.on(ClientActions.SERVER_CREATE_GAME, function () {
			server.createGame(socket);
		});

		socket.on(ClientActions.SERVER_START_GAME, function () {
			server.startGame(socket);
		});

		socket.on(ClientActions.SERVER_GAME_ACTION, function (action) {
			server.playerAction(socket, action);
		});

		socket.on(ActionNames.DISCONNECT, function () {
			server.playerDisconnect(socket);
		});

		socket.on(ClientActions.SERVER_QUIT_GAME, function () {
			var playerName = server.players.get(socket.id).name;
			server.playerDisconnect(socket).then(function () {
				return server.addNewPlayerToLobby(socket, playerName);
			});
		});

		socket.on(ClientActions.SERVER_UPDATE_INVISIBLE_MODE, function (action) {
			server.setInvisibleMode(socket, action);
		});
	});
};

function create(params) {
	var promise = new Promise(function (resolve, reject) {
		var app = require('http').createServer();
		initApp(app, params, function () {
			var io = require('socket.io')(app);
			var stop = function stop(cb) {
				io.close();
				app.close(function () {
					app.unref();
				});
				loginfo('Engine stopped.');
				cb();
			};

			initEngine(io);
			resolve({ stop: stop });
		});
	});
	return promise;
}
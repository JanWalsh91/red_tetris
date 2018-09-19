'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Game = require('./Game');

var _Game2 = _interopRequireDefault(_Game);

var _Player = require('./Player');

var _Player2 = _interopRequireDefault(_Player);

var _asyncLock = require('async-lock');

var _asyncLock2 = _interopRequireDefault(_asyncLock);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _serverActions = require('./../serverActions');

var ActionNames = _interopRequireWildcard(_serverActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
	function Server(io) {
		var _this = this;

		_classCallCheck(this, Server);

		this.updateGameState = function (player) {
			var gameState = {
				cells: player.board.getCells()
			};

			if (player.board.savedPiece) {
				gameState.savedPiece = player.board.savedPiece;
			}

			if (player.board.needToBroadcast) {
				_this.updateShadowBoard(player);
				gameState.score = player.score;
				gameState.level = _this.games.get(player.socketID).level;
				gameState.nextPieces = _this.getNextPieces(player);
				gameState.removedLines = player.board.removedLines;
				player.board.needToBroadcast = false;
			}

			_this.io.to(player.socketID).emit(ActionNames.UPDATE_GAME_STATE, gameState);
		};

		this.updateHostStatus = function (player) {
			var isHost = false;
			if (player.socketID == _this.games.get(player.socketID).host.socketID) {
				isHost = true;
			}
			_this.io.to(_this.games.get(player.socketID).id).emit(ActionNames.UPDATE_HOST_STATUS, isHost);
		};

		this.games = new Map();
		this.players = new Map();
		this.io = io;
		this.lock = new _asyncLock2.default();
	}

	/*
 *	Emits an updated list of available games to all sockets joined to 'lobby'
 */


	_createClass(Server, [{
		key: 'updateHostList',
		value: function updateHostList() {
			var joinableGames = new Map();
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.games[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _step$value = _slicedToArray(_step.value, 2),
					    socketID = _step$value[0],
					    game = _step$value[1];

					if (game && !game.isPlaying && game.players.length < _Game2.default.maxPlayers) {
						joinableGames.set(game.id, game.getInfo());
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			this.io.to('lobby').emit(ActionNames.UPDATE_HOST_LIST, [].concat(_toConsumableArray(joinableGames.values())).sort(function (a, b) {
				return a.id - b.id;
			}));
		}

		/*
  *	For a player, send its gameState to him
  */

	}, {
		key: 'getNextPieces',
		value: function getNextPieces(player) {
			return player.board.piecesList.slice(0, 3);
		}
	}, {
		key: 'updateShadowBoard',


		/*
  *	Emits the shadowBoard of a player to the whole room
  */
		value: function updateShadowBoard(player) {
			var update = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			var shadowCellData = {
				id: player.uuid,
				name: player.name,
				board: player.board.getShadowCells(),
				score: player.score,
				update: update
			};
			this.io.to(this.games.get(player.socketID).id).emit(ActionNames.UPDATE_SHADOW_STATE, shadowCellData);
		}
	}, {
		key: 'getGameByID',
		value: function getGameByID(gameID) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.games[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _step2$value = _slicedToArray(_step2.value, 2),
					    socketID = _step2$value[0],
					    game = _step2$value[1];

					if (game && game.id == gameID) {
						return game;
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return null;
		}
	}, {
		key: 'updatePlayerUUID',
		value: function updatePlayerUUID(player) {
			this.io.to(player.socketID).emit(ActionNames.UPDATE_PLAYER_UUID, player.uuid);
		}
	}, {
		key: 'updatePlayerName',
		value: function updatePlayerName(player) {
			this.io.to(player.socketID).emit(ActionNames.UPDATE_PLAYER_NAME, player.name);
		}
	}, {
		key: 'sendBestScore',
		value: function sendBestScore(socket) {
			var _this2 = this;

			this.readBestScore(function (leaderBoard) {
				_this2.io.to(socket.id).emit(ActionNames.UPDATE_LEADER_BOARD, leaderBoard);
			});
		}
	}, {
		key: 'onURLJoin',
		value: function onURLJoin(socket, data) {
			var _this3 = this;

			var URLJoin = function URLJoin() {
				_this3.lock.acquire("K", function (done) {
					_this3.players.set(socket.id, new _Player2.default(data.playerName, socket.id));

					var game = _this3.getGameByID(data.gameID);

					if (game && game.isPlaying) {
						_this3.io.to(socket.id).emit(ActionNames.SEND_ERROR_STATUS, "Can't join a game in progress");
					} else {
						_this3.updatePlayerUUID(_this3.players.get(socket.id));
						_this3.updatePlayerName(_this3.players.get(socket.id));
						if (game) {
							if (game.players.length > 3) {
								_this3.io.to(socket.id).emit(ActionNames.SEND_ERROR_STATUS, "Max players reached :/");
								done();
								return;
							}
							_this3.joinGame(socket, game.id);
						} else {
							_this3.createGame(socket, data.gameID);
						}
						_this3.io.to(socket.id).emit(ActionNames.SEND_ERROR_STATUS, null);
					}
					done();
				});
			};

			if (this.games.get(socket.id)) {
				this.playerDisconnect(socket).then(URLJoin);
			} else {
				URLJoin();
			}
		}
	}, {
		key: 'addNewPlayerToLobby',
		value: function addNewPlayerToLobby(socket, playerName) {
			this.players.set(socket.id, new _Player2.default(playerName, socket.id));
			this.games.set(socket.id, null);
			socket.join('lobby');
			this.updatePlayerUUID(this.players.get(socket.id));
			this.updateHostList();
		}
	}, {
		key: 'joinGame',
		value: function joinGame(socket, gameID) {
			var _this4 = this;

			var player = this.players.get(socket.id);
			var game = this.getGameByID(gameID);
			if (!game) return;

			game.players.push(player);

			this.games.set(socket.id, game);
			socket.leave('lobby');
			socket.join(gameID);

			this.updateHostList();
			socket.emit(ActionNames.UPDATE_GAME_JOINED, { gameJoined: true, gameID: gameID });

			game.initPlayerBoard(player);
			this.updateGameState(player);

			game.players.forEach(function (player) {
				_this4.updateShadowBoard(player);
			});
		}
	}, {
		key: 'createGame',
		value: function createGame(socket, gameID) {
			var player = this.players.get(socket.id);
			var game = new _Game2.default(player, gameID ? gameID : this.getValidGameID());
			this.games.set(socket.id, game);
			game.init();
			socket.leave('lobby');
			socket.join(game.id);
			this.updateHostList();
			socket.emit(ActionNames.UPDATE_GAME_JOINED, { gameJoined: true, gameID: game.id });
			game.initPlayerBoard(player);
			this.updateGameState(player);
			this.updateHostStatus(player);
		}
	}, {
		key: 'getValidGameID',
		value: function getValidGameID() {
			var i = 0;
			while (this.getGameByID(++i)) {}
			return i;
		}
	}, {
		key: 'startGame',
		value: function startGame(socket) {
			var _this5 = this;

			var player = this.players.get(socket.id);
			var game = this.games.get(socket.id);

			if (game.host.socketID !== socket.id || game.isPlaying) return;
			if (!game.isPlaying) {
				game.reset();
			}

			game.start();

			game.players.forEach(function (player) {
				player.board.setNextActivePiece();
				_this5.updateGameState(player);
			});

			game.ticFunction = function () {
				game.players.forEach(function (player) {
					if (player.board.gameOver) return;
					if (!player.board.moveDown()) {
						player.board.freezePiece(player.board.activePiece);
						player.board.removeFullLine();
						player.board.setNextActivePiece();

						_this5.updateShadowBoard(player);
					}
					_this5.updateGameState(player);
				});

				var bestScorePlayer = null;

				game.players.forEach(function (player) {
					if (player.isWinner) {
						_this5.io.to(player.socketID).emit(ActionNames.IS_WINNER);
					}
					if (bestScorePlayer == null || player.score > bestScorePlayer.score) {
						bestScorePlayer = player;
					}
					if (player.board.gameOver) {
						if (!game.playersLostList.includes(player.uuid)) {
							game.playersLostList.unshift(player.uuid);
						}
					}
				});

				// if all players' boards are game over
				if (game.players.every(function (player) {
					return player.board.gameOver;
				})) {
					clearInterval(game.interval);
					_this5.io.to(game.id).emit(ActionNames.END_GAME, game.playersLostList);

					game.isPlaying = false;
					_this5.writeBestScore(game.players.map(function (player) {
						return { playerName: player.name, score: player.score };
					}));
					_this5.updateHostList();
				}
			};

			game.setGameTic();
			this.updateHostList();

			this.io.to(game.id).emit(ActionNames.UPDATE_GAME_START);
		}
	}, {
		key: 'playerAction',
		value: function playerAction(socket, action) {
			var player = this.players.get(socket.id);
			if (player.board.gameOver) return;
			var game = this.games.get(socket.id);

			switch (action) {
				case "downShortcut":
					player.board.downShortcut();
					this.updateGameState(player);
					break;
				case "left":
					player.board.moveLeft();
					this.updateGameState(player);
					break;
				case "right":
					player.board.moveRight();
					this.updateGameState(player);
					break;
				case "down":
					player.board.moveDown();
					this.updateGameState(player);
					break;
				case "rotate":
					player.board.rotate();
					this.updateGameState(player);
					break;
				case "savePiece":
					player.board.savePiece();
					this.updateGameState(player);
				default:
					break;
			}
		}
	}, {
		key: 'setInvisibleMode',
		value: function setInvisibleMode(socket, action) {
			var player = this.players.get(socket.id);
			var game = this.games.get(socket.id);
			if (game.host.socketID !== socket.id || game.isPlaying) return;

			game.setInvisibleMode(action);
		}
	}, {
		key: 'playerDisconnect',
		value: function playerDisconnect(socket) {
			var _this6 = this;

			return new Promise(function (resolve, reject) {
				_this6.lock.acquire("K", function (done) {
					var game = _this6.games.get(socket.id);
					var player = _this6.players.get(socket.id);
					if (player && game) {
						_this6.updateShadowBoard(player, false);
					}
					socket.leave('lobby');
					_this6.players.delete(socket.id);
					_this6.games.delete(socket.id);
					if (!game) {
						done();return;
					}

					game.players = game.players.filter(function (player) {
						return player.socketID != socket.id;
					});

					if (game.players.length == 0) {
						game.isPlaying = false;
						_this6.updateHostList();
						clearInterval(game.interval);
					} else if (game.host.socketID == socket.id) {
						game.host = game.players[0];
						_this6.io.to(game.host.socketID).emit(ActionNames.UPDATE_HOST_STATUS, true);
					}
					socket.leave(game.id, function () {
						done();
					});
				}).then(resolve);
			});
		}
	}, {
		key: 'writeBestScore',
		value: function writeBestScore(playerScores) {
			var _this7 = this;

			this.lock.acquire("writeHighScores", function (done) {

				var filePath = __dirname + '/../../../bestScore';

				var highScore = _this7.readBestScore(function (highScores) {
					var _highScores;

					(_highScores = highScores).push.apply(_highScores, _toConsumableArray(playerScores));
					highScores.sort(function (a, b) {
						return b.score - a.score;
					});
					highScores = highScores.slice(0, 9);

					_fs2.default.writeFile(filePath, JSON.stringify(highScores), function (err) {
						if (err) console.log(err);
					});
					return highScores;
				});

				done();
			});
		}
	}, {
		key: 'readBestScore',
		value: function readBestScore(cb) {

			var filePath = __dirname + '/../../../bestScore';
			_fs2.default.readFile(filePath, function (err, data) {
				var highScores = null;
				try {
					highScores = JSON.parse(data);
				} catch (err) {
					highScores = [];
				}
				if (cb) {
					cb(highScores);
				}
			});
		}
	}]);

	return Server;
}();

exports.default = Server;
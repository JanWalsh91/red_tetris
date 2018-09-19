'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Piece = require('./Piece');

var _Piece2 = _interopRequireDefault(_Piece);

var _Board = require('./Board');

var _Board2 = _interopRequireDefault(_Board);

var _Server = require('./Server');

var _Server2 = _interopRequireDefault(_Server);

var _serverActions = require('../serverActions');

var ActionNames = _interopRequireWildcard(_serverActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
	function Game(player, gameID) {
		_classCallCheck(this, Game);

		this.id = Game.gameCount++;
		this.host = player;
		this.isPlaying = false;
		this.players = [player];
		this.piecesList = [];
		this.level = 0;
		this.highestScore = 0;
		this.interval = undefined;
		if (gameID) {
			this.id = gameID;
		}
		this.playersLostList = [];
	}

	_createClass(Game, [{
		key: 'getInfo',
		value: function getInfo() {
			return {
				id: this.id,
				hostName: this.host.name,
				playerCount: this.players.length
			};
		}
	}, {
		key: 'init',
		value: function init() {
			this.addPieces();
		}
	}, {
		key: 'initPlayerBoard',
		value: function initPlayerBoard(player) {
			var _this = this;

			if (!player) return;

			player.board = new _Board2.default({
				getPiecesFromGame: function getPiecesFromGame(board) {
					if (board.piecesCopiedCount - _this.piecesList.length < 5) {
						var _piecesList;

						(_piecesList = _this.piecesList).push.apply(_piecesList, _toConsumableArray(_Piece2.default.generateRandomPieces(Game.newPiecesCount)));
					}
					if (board.piecesList.length < 5) {
						board.addPieces(_this.piecesList.slice(board.piecesCopiedCount, board.piecesCopiedCount + 5).map(function (piece) {
							return new _Piece2.default(piece);
						}));
						board.piecesCopiedCount += 5;
					}
				},
				updateScoreAndFrozenLinesInGame: function updateScoreAndFrozenLinesInGame(linesRemoved) {
					var multiplier = [40, 100, 250, 600];
					player.score += multiplier[linesRemoved - 1] * (_this.level + 1);
					_this.updateGameLevel(player.score);

					if (linesRemoved >= 2) {
						_this.players.forEach(function (p) {
							if (player.socketID != p.socketID) {
								p.board.frozenLines += linesRemoved - 1;
							}
						});
					}
				},
				checkForEndGame: function checkForEndGame() {
					if (_this.players.every(function (p) {
						return p.board.gameOver;
					})) {
						player.isWinner = true;
					}
				}
			});
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.players.forEach(function (player) {
				player.reset();
				player.board.reset();
			});
			this.piecesList = [];
			this.level = 0;
			this.highestScore = 0;
			this.playersLostList = [];
		}
	}, {
		key: 'setGameTic',
		value: function setGameTic() {
			var ticTime = 1000 / Math.log2(this.level + 2);

			if (this.interval != undefined) {
				clearInterval(this.interval);
			}
			this.interval = setInterval(this.ticFunction, ticTime);
		}
	}, {
		key: 'updateGameLevel',
		value: function updateGameLevel(playerScore) {
			var thresholds = [600, 1800, 3600, 6000, 9000, 12600, 16800, 21600, 27000, 33000];
			if (playerScore > this.highestScore) {
				this.highestScore = playerScore;
				if (this.highestScore > thresholds[this.level] && this.level < thresholds.length - 1) {
					while (this.highestScore > thresholds[this.level] && this.level < thresholds.length - 1) {
						this.level++;
					}
					this.setGameTic();
				}
			}
		}
	}, {
		key: 'setInvisibleMode',
		value: function setInvisibleMode(invisibleMode) {
			this.players.forEach(function (player) {
				player.board.setInvisibleMode(invisibleMode);
			});
		}
	}, {
		key: 'start',
		value: function start() {
			this.isPlaying = true;
		}
	}, {
		key: 'addPieces',
		value: function addPieces() {
			var _piecesList2;

			(_piecesList2 = this.piecesList).push.apply(_piecesList2, _toConsumableArray(_Piece2.default.generateRandomPieces(Game.newPiecesCount)));
		}
	}]);

	return Game;
}();

Game.gameCount = 0;
Game.maxPlayers = 4;
Game.newPiecesCount = 10;
exports.default = Game;
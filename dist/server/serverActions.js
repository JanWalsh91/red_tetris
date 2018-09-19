'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Client callbacks
var UPDATE_HOST_LIST = exports.UPDATE_HOST_LIST = 'UPDATE_HOST_LIST';
var UPDATE_GAME_JOINED = exports.UPDATE_GAME_JOINED = 'UPDATE_GAME_JOINED';
var SEND_GAME_ACTION = exports.SEND_GAME_ACTION = 'SEND_GAME_ACTION';
var START_GAME = exports.START_GAME = 'START_GAME';

// Server callbacks
var CONNECTION = exports.CONNECTION = 'connection';
var DISCONNECT = exports.DISCONNECT = 'disconnect';
var ADD_NEW_PLAYER_TO_LOBBY = exports.ADD_NEW_PLAYER_TO_LOBBY = 'ADD_NEW_PLAYER_TO_LOBBY';
var JOIN_GAME = exports.JOIN_GAME = 'JOIN_GAME';
var CREATE_GAME = exports.CREATE_GAME = 'CREATE_GAME';
var UPDATE_GAME_STATE = exports.UPDATE_GAME_STATE = 'UPDATE_GAME_STATE';
var UPDATE_SHADOW_STATE = exports.UPDATE_SHADOW_STATE = 'UPDATE_SHADOW_STATE';
var UPDATE_HOST_STATUS = exports.UPDATE_HOST_STATUS = 'UPDATE_HOST_STATUS';
var UPDATE_PLAYER_UUID = exports.UPDATE_PLAYER_UUID = 'UPDATE_PLAYER_UUID';
var UPDATE_PLAYER_NAME = exports.UPDATE_PLAYER_NAME = 'UPDATE_PLAYER_NAME';
var SEND_ERROR_STATUS = exports.SEND_ERROR_STATUS = 'SEND_ERROR_STATUS';
var UPDATE_GAME_START = exports.UPDATE_GAME_START = 'UPDATE_GAME_START';
var QUIT_GAME = exports.QUIT_GAME = 'QUIT_GAME';
var IS_WINNER = exports.IS_WINNER = 'IS_WINNER';
var END_GAME = exports.END_GAME = 'END_GAME';
var UPDATE_LEADER_BOARD = exports.UPDATE_LEADER_BOARD = 'UPDATE_LEADER_BOARD';
var UPDATE_INVISIBLE_MODE = exports.UPDATE_INVISIBLE_MODE = 'UPDATE_INVISIBLE_MODE';
import chai from "chai"
import { expect } from 'chai'

import * as Actions from '../src/client/actions/client'
import * as ServerActions from '../src/client/actions/server'

describe('action test', function() {

	it('updateHostList', function() {
		let hostList = 1;
		expect(Actions.updateHostList(hostList)).deep.equal({type: Actions.UPDATE_HOST_LIST, hostList});
	});

	it('updatePlayerName', function() {
		let playerName = '1';
		expect(Actions.updatePlayerName(playerName)).deep.equal({type: Actions.UPDATE_PLAYER_NAME, playerName});
	});

	it('updateSelectedGame', function() {
		let hostID = '1';
		expect(Actions.updateSelectedGame(hostID)).deep.equal({type: Actions.UPDATE_SELECTED_GAME, hostID});
	});

	it('updateGameJoined', function() {
		let action = {
			gameJoined: true,
			gameID: 1
		};
		expect(Actions.updateGameJoined(action)).deep.equal({type: Actions.UPDATE_GAME_JOINED, ...action});
	});

	it('updateGameState', function() {
		let gameState = '1';
		expect(Actions.updateGameState(gameState)).deep.equal({type: Actions.UPDATE_GAME_STATE, gameState});
	});

	it('updateShadowState', function() {
		let shadowCellsData = '1';
		expect(Actions.updateShadowState(shadowCellsData)).deep.equal({type: Actions.UPDATE_SHADOW_STATE, shadowCellsData});
	});

	it('updateHostStatus', function() {
		let isHost = '1';
		expect(Actions.updateHostStatus(isHost)).deep.equal({type: Actions.UPDATE_HOST_STATUS, isHost});
	});

	it('updatePlayerUUID', function() {
		let playerUUID = '1';
		expect(Actions.updatePlayerUUID(playerUUID)).deep.equal({type: Actions.UPDATE_PLAYER_UUID, playerUUID});
	});

	it('updateError', function() {
		let errorMessage = '1';
		expect(Actions.updateError(errorMessage)).deep.equal({type: Actions.UPDATE_ERROR, errorMessage});
	});

	it('resetState', function() {
		let newState = '1';
		expect(Actions.resetState(newState)).deep.equal({type: Actions.RESET_STATE, newState});
	});

	it('updateGameStart', function() {
		expect(Actions.updateGameStart()).deep.equal({type: Actions.UPDATE_GAME_START});
	});

	it('isWinner', function() {
		expect(Actions.isWinner()).deep.equal({type: Actions.IS_WINNER});
	});

	it('endGame', function() {
		let action = Actions.endGame();
		expect(action.type).equal(Actions.END_GAME);
		expect(action.playersLostList).equal(undefined);
	});

	it('updateLeaderBoard', function() {
		let leaderBoard = '1';
		expect(Actions.updateLeaderBoard(leaderBoard)).deep.equal({type: Actions.UPDATE_LEADER_BOARD, leaderBoard});
	});

	it('updateInvisibleMode', function() {
		let invisibleMode = '1';
		expect(Actions.updateInvisibleMode(invisibleMode)).deep.equal({type: Actions.UPDATE_INVISIBLE_MODE, invisibleMode});
	});

	it('toggleInstructions', function() {
		expect(Actions.toggleInstructions()).deep.equal({type: Actions.TOGGLE_INSTRUCTIONS});
	});
})

describe('server action test', function() {

	it('serverCreateGame', function() {
		expect(ServerActions.serverCreateGame()).deep.equal({type: ServerActions.SERVER_CREATE_GAME});
	});

	it('serverJoinGame', function() {
		let gameSelected = 1;
		expect(ServerActions.serverJoinGame(gameSelected)).deep.equal({type: ServerActions.SERVER_JOIN_GAME, payload: gameSelected});
	});

	it('serverGameAction', function() {
		let gameAction = 'left';
		expect(ServerActions.serverGameAction(gameAction)).deep.equal({type: ServerActions.SERVER_GAME_ACTION, payload: gameAction});
	});

	it('serverStartGame', function() {
		expect(ServerActions.serverStartGame()).deep.equal({type: ServerActions.SERVER_START_GAME});
	});

	it('serverQuitGame', function() {
		expect(ServerActions.serverQuitGame()).deep.equal({type: ServerActions.SERVER_QUIT_GAME});
	});

	it('serverAddNewPlayerToLobby', function() {
		let name = "Josephe";
		expect(ServerActions.serverAddNewPlayerToLobby(name)).deep.equal({type: ServerActions.SERVER_ADD_NEW_PLAYER_TO_LOBBY, payload: name});
	});

	it('serverUpdateInvisibleMode', function() {
		let isInvisibleMode = false;
		expect(ServerActions.serverUpdateInvisibleMode(isInvisibleMode)).deep.equal({type: ServerActions.SERVER_UPDATE_INVISIBLE_MODE, payload: isInvisibleMode});
	});
})

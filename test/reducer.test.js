import chai from "chai"
import { expect } from 'chai'

import reducer from '../src/client/reducers'
import * as Actions from '../src/client/actions/client'

describe('reducer test', function() {

	// let state = {}

	it('updateHostList', function() {
		let hostList = 1;
		expect(reducer(undefined, Actions.updateHostList(hostList)).hostList).equal(hostList);
	});

	it('updatePlayerName', function() {
		let playerName = '1';
		expect(reducer(undefined, Actions.updatePlayerName(playerName)).playerName).equal(playerName);
	});

	it('updateSelectedGame', function() {
		let gameSelected = '1';
		expect(reducer(undefined, Actions.updateSelectedGame(gameSelected)).gameSelected).equal(gameSelected);
	});

	it('updateGameJoined', function() {
		let gameJoined = '1';
		let gameID = 2;
		let state = reducer(undefined, Actions.updateGameJoined({gameJoined, gameID}));

		expect(state.gameJoined).equal(gameJoined);
		expect(state.gameID).equal(gameID);
	});

	it('updateGameState', function() {
		let gameState = {
			a: 1
		};

		expect(reducer(undefined, Actions.updateGameState(gameState)).gameState).deep.equal(gameState);
	});

	it('updateShadowState', function() {
		let state = undefined;
		let shadowCellsData = {	id: 1, update: true };
		// shadowState undefined
		state = reducer(undefined, Actions.updateShadowState(shadowCellsData));
		expect(state.shadowState.get(1)).equal(shadowCellsData);

		shadowCellsData = {	id: 1, update: false };
		state = reducer(state, Actions.updateShadowState(shadowCellsData));
		expect(state.shadowState.get(1)).equal(undefined);
	});

	it('updateHostStatus', function() {
		let isHost = 1;
		expect(reducer(undefined, Actions.updateHostStatus(isHost)).isHost).equal(isHost);
	});

	it('updatePlayerUUID', function() {
		let playerUUID = 1;
		expect(reducer(undefined, Actions.updatePlayerUUID(playerUUID)).playerUUID).equal(playerUUID);
	});

	it('updateError', function() {
		let state = undefined;
		let errorMessage = '500';

		state = reducer(state, Actions.updateError(errorMessage));
		expect(state.errorMessage).equals(errorMessage);

		state.gameJoined = true;
		state = reducer(state, Actions.updateError(errorMessage));
		expect(state.gameJoined).equals(false);
	});

	it('updateGameStart', function() {
		let gameStart = 1;
		let state = reducer(undefined, Actions.updateGameStart());
		expect(state.gameStart).equal(true);
		expect(state.endGame).equal(false);
	});

	it('isWinner', function() {
		let isWinner = true;
		expect(reducer(undefined, Actions.isWinner(isWinner)).isWinner).equal(isWinner);
	});

	it('isWinnerByScore', function() {
		let isWinnerByScore = true;
		expect(reducer(undefined, Actions.isWinnerByScore(isWinnerByScore)).isWinnerByScore).equal(isWinnerByScore);
	});


	it('endGame', function() {
		let gameStart = 1;
		let state = reducer(undefined, Actions.endGame());
		expect(state.gameStart).equal(false);
		expect(state.endGame).equal(true);
	});

	it('updateLeaderBoard', function() {
		let leaderBoard = true;
		expect(reducer(undefined, Actions.updateLeaderBoard(leaderBoard)).leaderBoard).equal(leaderBoard);
	});

	it('updateInvisibleMode', function() {
		let invisibleMode = true;
		expect(reducer(undefined, Actions.updateInvisibleMode(invisibleMode)).invisibleMode).equal(invisibleMode);
	});



})

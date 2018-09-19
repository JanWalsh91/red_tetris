import React from 'react'
import { connect } from 'react-redux'
import styles from './main.css'
import PlayerForm from '../../../components/playerForm/playerForm'
import LeaderBoard from '../../../components/leaderBoard/leaderBoard'
import HostList from '../../../components/hostList/hostList'
import Board from '../../../components/board/board'
import ShadowBoard from '../../../components/shadowBoard/shadowBoard'
import EndGameLeaderBoard from '../../../components/endGameLeaderBoard/endGameLeaderBoard'
import GameData from '../../../components/gameData/gameData'
import Button from '../../../components/button/button'

import {updatePlayerName, updateSelectedGame, resetState, updateInvisibleMode} from '../../../actions/client'
import {serverCreateGame, serverJoinGame, serverAddNewPlayerToLobby, serverStartGame, serverQuitGame, serverUpdateInvisibleMode} from '../../../actions/server'

import * as ActionNames from '../../../../server/serverActions'

const Main = ( props ) => {
	const startGame = () => {
		props.serverStartGame();
		document.getElementById('audio').loop = true;
		document.getElementById('audio').play();
	}

	const quitGame = () => {
		document.getElementById('audio').loop = false;
		document.getElementById('audio').currentTime = 0.0;
		document.getElementById('audio').pause();
		props.serverQuitGame();
		props.resetState({playerName: props.playerName});
		window.history.pushState(null, '', '/');
	}

	const updateName = () => {
		let name = document.getElementById('playerInputName').value;

		if (name != undefined && name.length > 0) {
			props.serverAddNewPlayerToLobby(name);
			props.onUpdatePlayerName(name);
		}
	}

	const updateInvisibleMode = () => {
		let isInvisibleMode = document.getElementById('invisibleMode').checked
		props.serverUpdateInvisibleMode(isInvisibleMode);
		props.updateInvisibleMode(isInvisibleMode);
	}

	let buttons = null;
	let content = null;

	if (props.playerName === undefined || props.playerName.length == 0) {
		content = (
			<div className={styles.playerFormContainer}>
				<PlayerForm onUpdateName={updateName}></PlayerForm>
				<LeaderBoard players={props.leaderBoard}/>
			</div>
		);
	}
	else {
		let startButton = null;
		let invisibleMode = null;
		if (props.isHost) {
			if (!props.gameStart) {
				startButton = <Button onClick={startGame} value="Start Game"/>;
				invisibleMode = (
					<span>
						<input id="invisibleMode" onChange={updateInvisibleMode} type="checkbox" checked={!!props.invisibleMode} />
						<label htmlFor="invisibleMode">Invisible Mode</label>
					</span>
				)
			}
		} else {
			if (props.gameStart) {
				if (document.getElementById('audio').paused) {
					document.getElementById('audio').play();
				}
			}
		}

		if (props.gameJoined) {
			buttons = (
				<div className={styles.buttons}>
					<div>
						{startButton}
						<Button id="quitGameButton" onClick={quitGame} value="Quit Game"/>
					</div>
					<div>
						{invisibleMode}
					</div>
				</div>
			);
		}

		let endGameContent = null;
		if (props.endGame) {
			endGameContent = <EndGameLeaderBoard
				uuid={props.playerUUID}
				isWinnerByScore={props.isWinnerByScore}
				isWinner={props.isWinner}
				playersInfo={props.shadowState}
				playersLostList={props.playersLostList}
			/>
		}

		if (props.gameJoined) {
			content = (
				<div className={styles.gameArea}>
					<div className={styles.shadowBoard}>
						<ShadowBoard playerUUID={props.playerUUID} shadowState={props.shadowState}/>
					</div>
					<div className={styles.boardWrapper}>
						<Board gameState={props.gameState}/>
						{endGameContent}
					</div>
					<div>
						<GameData gameData={props.gameState}/>
					</div>
					<audio controls loop="true" id="audio" className={styles.audio}>
							<source src="/public/mainTheme.mp3" type="audio/mpeg"/>
					</audio>
				</div>
			)
		}
		else {
			content = (
				<HostList
					hostList={props.hostList}
					gameSelected={props.gameSelected}
					onSelectGame={props.onSelectGame}
					createGame={props.serverCreateGame}
					joinGame={props.serverJoinGame}>
				</HostList>
			);
		}
	}
	return (
		<div className={styles.main}>
			{content}
			{buttons}
		</div>
	)
}

const mapStateToProps = (state) => {

	return {
		hostList: state.hostList,
		playerName: state.playerName,
		gameSelected: state.gameSelected,
		gameJoined: state.gameJoined,
		gameState: state.gameState,
		shadowState: state.shadowState,
		isHost: state.isHost,
		playerUUID: state.playerUUID,
		gameStart: state.gameStart,
		isWinner: state.isWinner,
		isWinnerByScore: state.isWinnerByScore,
		endGame: state.endGame,
		leaderBoard: state.leaderBoard,
		invisibleMode: state.invisibleMode,
		playersLostList: state.playersLostList
	}
}

const mapDispatchToProps = dispatch => {
	return {
		serverAddNewPlayerToLobby: name => dispatch(serverAddNewPlayerToLobby(name)),
		serverStartGame: () => dispatch(serverStartGame()),
		serverQuitGame: () => dispatch(serverQuitGame()),
		serverUpdateInvisibleMode: isInvisibleMode => dispatch(serverUpdateInvisibleMode(isInvisibleMode)),

		onUpdatePlayerName: playerName => dispatch(updatePlayerName(playerName)),
		onSelectGame: hostID => dispatch(updateSelectedGame(hostID)),
		onUpdateGameJoined: gameJoined => dispatch(onUpdateGameJoined(gameJoined)),
		resetState: action => dispatch(resetState(action)),
		updateInvisibleMode: isInvisibleMode => dispatch(updateInvisibleMode(isInvisibleMode)),
		serverCreateGame: () => dispatch(serverCreateGame()),
		serverJoinGame: gameSelected => dispatch(serverJoinGame(gameSelected))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

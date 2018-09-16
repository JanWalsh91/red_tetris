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
import socket from '../../../socket'
import {updatePlayerName, updateSelectedGame, resetState, updateInvisibleMode} from '../../../actions/client'


import * as ActionNames from '../../../../server/serverActions'

const Main = ( props ) => {

	// window.sound = new Audio('/src/client/mainTheme.mp3');

	const startGame = () => {
		socket.emit(ActionNames.START_GAME);
		document.getElementById('audio').loop = true;
		document.getElementById('audio').play();
	}
	const quitGame = () => {
		console.log('QuitGame');
		document.getElementById('audio').loop = false;
		document.getElementById('audio').currentTime = 0.0;
		document.getElementById('audio').pause();
		delete window.sound;
		socket.emit(ActionNames.QUIT_GAME);
		props.resetState({playerName: props.playerName});
		window.history.pushState(null, '', '/');
	}
	const updateName = () => {
		let name = document.getElementById('playerInputName').value;

		if (name != undefined && name.length > 0) {
			socket.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, name);
			props.onUpdatePlayerName(name);
		}
		else {
			// erorr
			// display message
		}
	}

	const updateInvisibleMode = () => {
		let isInvisibleMode = document.getElementById('invisibleMode').checked
		socket.emit(ActionNames.UPDATE_INVISIBLE_MODE, isInvisibleMode);
		props.updateInvisibleMode(isInvisibleMode);
	}

	let content;

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
			console.log("salut");
			if (!props.gameStart) {
				startButton = <Button onClick={startGame} value="Start Game"/>;
				invisibleMode = (
					<span>
						<input id="invisibleMode" onChange={updateInvisibleMode} type="checkbox" checked={!!props.invisibleMode} />
						<label htmlFor="invisibleMode">Invisible Mode</label>
					</span>
				)
			}
		}

		let buttons = (
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

		let endGameContent = null;
		if (props.endGame) {
			endGameContent = <EndGameLeaderBoard uuid={props.playerUUID} isWinnerByScore={props.isWinnerByScore} isWinner={props.isWinner} playersInfo={props.shadowState}/>
		}

		// console.log("MAIN PROPS: ", props);

		if (props.gameJoined) {
			content = (
				<div>
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
  							<source src="/src/client/mainTheme.mp3" type="audio/mpeg"/>
						</audio>
					</div>
					{buttons}
				</div>
			)
		}
		else {
			content = (
				<HostList
					hostList={props.hostList}
					gameSelected={props.gameSelected}
					onSelectGame={props.onSelectGame}>
				</HostList>
			);
		}
	}
	return (
		<div className={styles.main}>
			{content}
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
		invisibleMode: state.invisibleMode
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onUpdatePlayerName: playerName => dispatch(updatePlayerName(playerName)),
		onSelectGame: hostID => dispatch(updateSelectedGame(hostID)),
		onUpdateGameJoined: gameJoined => dispatch(onUpdateGameJoined(gameJoined)),
		resetState: action => dispatch(resetState(action)),
		updateInvisibleMode: isInvisibleMode => dispatch(updateInvisibleMode(isInvisibleMode))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

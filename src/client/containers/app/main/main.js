import React from 'react'
import { connect } from 'react-redux'
import styles from './main.css'
import PlayerForm from '../../../components/playerForm/playerForm'
import HostList from '../../../components/hostList/hostList'
import Board from '../../../components/board/board'
import ShadowBoard from '../../../components/shadowBoard/shadowBoard'
import GameData from '../../../components/gameData/gameData'
import Button from '../../../components/button/button'
import socket from '../../../socket'
import {updatePlayerName, updateSelectedGame, resetState} from '../../../actions/client'

import * as ActionNames from '../../../../server/serverActions'

const Main = ( props ) => {

	const startGame = () => {
		socket.emit(ActionNames.START_GAME);
	}
	const quitGame = () => {
		socket.emit(ActionNames.QUIT_GAME);
		props.resetState({playerName: props.playerName});
		window.history.pushState(null, '', '/');
	}
	const updateName = () => {
		let name = document.getElementById('playerInputName').value;
		console.log("PlayerName: ", name);

		if (name != undefined && name.length > 0) {
			console.log("Emit new player");
			socket.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, name);
			props.onUpdatePlayerName(name);
		}
		else {
			// erorr
			// display message
		}
	}

	let content;

	if (props.playerName === undefined || props.playerName.length == 0) {
		content = (<PlayerForm onUpdateName={updateName}></PlayerForm>);
	}
	else {
		let startButton = null;
		if (props.isHost) {
			if (!props.gameStart) {
				startButton = <Button onClick={startGame} value="Start Game"/>;
			}
		}

		let buttons = (
			<div className={styles.buttons}>
				{startButton}
				<Button onClick={quitGame} value="Quit Game"/>
			</div>
		);

		if (props.gameJoined) {
			content = (
				<div>
					<div className={styles.gameArea}>
						<div className={styles.shadowBoard}>
							<ShadowBoard playerUUID={props.playerUUID} shadowState={props.shadowState}/>
						</div>
						<div className={styles.boardWrapper}>
							<Board gameState={props.gameState} isWinner={props.isWinner} isWinnerByScore={props.isWinnerByScore}/>
						</div>
						<div>
							<GameData gameData={props.gameState}/>
						</div>
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
		isWinnerByScore: state.isWinnerByScore
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onUpdatePlayerName: playerName => dispatch(updatePlayerName(playerName)),
		onSelectGame: hostID => dispatch(updateSelectedGame(hostID)),
		onUpdateGameJoined: gameJoined => dispatch(onUpdateGameJoined(gameJoined)),
		resetState: action => dispatch(resetState(action))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

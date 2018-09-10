import React from 'react'
import { connect } from 'react-redux'
import styles from './main.css'
import PlayerForm from '../../../components/playerForm/playerForm'
import HostList from '../../../components/hostList/hostList'
import Board from '../../../components/board/board'
import ShadowBoard from '../../../components/shadowBoard/shadowBoard'
import Button from '../../../components/button/button'
import socket from '../../../socket'
import {updatePlayerName, updateSelectedGame} from '../../../actions/client'

import * as ActionNames from '../../../../server/serverActions'

const Main = ( props ) => {

	const startGame = () => {
		socket.emit(ActionNames.START_GAME);
	}

	let content;

	console.log("======== PROPS ============ ");
	console.log(props);

	if (props.playerName === undefined || props.playerName.length == 0) {
		content = (<PlayerForm onUpdateName={ () => props.onUpdatePlayerName()}></PlayerForm>);
	}
	else {

		console.log("gameJoined: ", props.gameJoined);

		let button = null;

		console.log("isHost: ", props.isHost );

		if (props.isHost) {
			button = <Button onClick={startGame} value="Start Game"/>;
		}

		if (props.gameJoined) {
			content = (
				<div className={styles.gameArea}>
					<div className={styles.shadowBoard}>
						<ShadowBoard shadowState={props.shadowState}/>
					</div>
					<div>
						<Board gameState={props.gameState}/>
						 {button}
					</div>
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
		isHost: state.isHost
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onUpdatePlayerName: playerName => dispatch(updatePlayerName(playerName)),
		onSelectGame: hostID => dispatch(updateSelectedGame(hostID)),
		onUpdateGameJoined: gameJoined => dispatch(onUpdateGameJoined(gameJoined))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

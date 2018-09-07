import React from 'react'
import { connect } from 'react-redux'
import styles from './main.css'
import PlayerForm from '../../../components/playerForm/playerForm'
import HostList from '../../../components/hostList/hostList'
import Board from '../../../components/board/board'
import socket from '../../../socket'
import {updatePlayerName, updateSelectedGame} from '../../../actions/client'

// import * as ActionNames from '../../../../server/serverActions'

const Main = ( props ) => {

	const test = (event) => {
		console.log("==============:",  event);
	}


	let content;

	if (props.playerName === undefined || props.playerName.length == 0) {
		content = (<PlayerForm onUpdateName={ () => props.onUpdatePlayerName()}></PlayerForm>);
	}
	else {

		console.log("gameJoined: ", props.gameJoined);

		if (props.gameJoined) {
			content = (
				<Board gameState={props.gameState}/>
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
		gameState: state.gameState
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

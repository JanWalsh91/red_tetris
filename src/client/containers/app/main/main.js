import React from 'react'
import { connect } from 'react-redux'
import styles from './main.css'
import PlayerForm from '../../../components/playerForm/playerForm'
import HostList from '../../../components/hostList/hostList'

import socket from '../../../socket'

import {updatePlayerName, updateSelectedGame} from '../../../actions/client'

// import * as ActionNames from '../../../../server/serverActions'

const Main = ( props ) => {

	// const onUpdateName = () => {
	// 	// console.log("selectGame: ", hostID);
	//
	// 	// socket.emit('action', {
	// 	// 	hostID: hostID,
	// 	// 	playerName: 'playerName'
	// 	// });
	//
	// 	props.onUpdatePlayerName(document.getElementById('playerInputName').value);
	// 	console.log("PlayerName: ", props.playerName);
	//
	// 	if (props.playerName != null && props.playerName.length > 0) {
	//
	// 		console.log("Emit new player");
	// 		socket.emit(ActionNames.NEW_PLAYER, props.playerName);
	// 	}
	// 	else {
	// 		//Error
	// 	}
	//
	// }

	// if (props.playerName.length > 0)
	// 	socket.emit(ActionNames.NEW_PLAYER, props.playerName);

	let content;

	if (props.playerName === undefined || props.playerName.length == 0) {
		content = (<PlayerForm onUpdateName={ () => props.onUpdatePlayerName()}></PlayerForm>);
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
		gameSelected: state.gameSelected
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onUpdatePlayerName: playerName => dispatch(updatePlayerName(playerName)),
		onSelectGame: hostID => dispatch(updateSelectedGame(hostID))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

import React from 'react'
import styles from './hostList.css'
import Host from './host/host'

import socket from '../../socket'

import * as ActionNames from '../../../server/serverActions'

const hostList = ( props ) => {

	let content = <div></div>

	const joinGame = () => {
		console.log("joinGame");

		// socket.emit(ActionNames.JOIN_GAME, {
		// 	hostID: hostID
		// });

		socket.emit(ActionNames.JOIN_GAME, props.gameSelected);
	}

	const createGame = () => {
		console.log("createGame");

		socket.emit(ActionNames.CREATE_GAME);
	}

	if (props.hostList) {
		content = props.hostList.map( host => {
			return <Host
				key={host.id}
				host={host}
				selectGame={() => props.onSelectGame(host.id)}
				isSelected={host.id == props.gameSelected}
			/>;
		});
	}

	return (
		<div className={styles.hostList}>
			{content}
			<input
				onClick={() => props.gameSelected != null ? joinGame({/* create new game*/}) : createGame()}
				type='button'
				value={props.gameSelected != null ? "JOIN GAME #" + props.gameSelected : "CREATE GAME" }
			/>
		</div>
	)
}

export default hostList

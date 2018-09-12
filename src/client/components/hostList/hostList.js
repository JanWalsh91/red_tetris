import React from 'react'
import styles from './hostList.css'
import Host from './host/host'
import Button from '../button/button'

import socket from '../../socket'

import * as ActionNames from '../../../server/serverActions'

const hostList = ( props ) => {

	let content = null;

	const joinGame = () => {
		console.log("joinGame");
		socket.emit(ActionNames.JOIN_GAME, props.gameSelected);
		// TODO: update gameJoined

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
			<Button onClick={() => props.gameSelected != null ? joinGame() : createGame()} type='button'
				value={props.gameSelected != null ? "JOIN GAME #" + props.gameSelected : "CREATE GAME" }
			/>
		</div>
	)
}

export default hostList

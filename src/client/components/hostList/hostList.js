import React from 'react'
import styles from './hostList.css'
import Host from './host/host'
import Button from '../button/button'

import socket from '../../socket'

import * as ActionNames from '../../../server/serverActions'

const hostList = ( props ) => {

	let content = null;

	const joinGame = () => {
		socket.emit(ActionNames.JOIN_GAME, props.gameSelected);
	}

	const createGame = () => {
		socket.emit(ActionNames.CREATE_GAME);
	}

	let button = null;
		console.log(props.hostList);
		if (props.gameSelected != null && props.hostList.find(el => el.id == props.gameSelected )) {
			button = (
				<Button onClick={joinGame} type='button'
					value={"JOIN GAME #" + props.gameSelected}
				/>
			)
		} else {
			button = (
				<Button onClick={createGame} type='button'
					value={"CREATE GAME"}
				/>
			)
		}


	if (props.hostList) {
		console.log("creating lsit of hosts: ", props.hostList);
		content = props.hostList.map( host => {
			console.log("creating host");
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
			<div className={styles.list}>
				{content}
			</div>
			{button}
		</div>
	)
}

export default hostList

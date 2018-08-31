import React from 'react'
import styles from './hostList.css'
import Host from './host/host'

import socket from '../../socket'

const hostList = ( props ) => {

	let content = <div></div>

	const selectGame = (hostID) => {
		console.log("selectGame: ", hostID);

		socket.emit('selectGame', {
			hostID: hostID,
			playerName: 'playerName'
		});
	}

	if (props.hostList) {
		content = props.hostList.map( host => {
			return <Host key={host.id} host={host} selectGame={() => selectGame(host.id)}/>;
		});
	}

	return (
		<div className={styles.hostList}>
			{content}
			<input onClick={() => selectGame()} type='button'/>
		</div>
	)
}

export default hostList

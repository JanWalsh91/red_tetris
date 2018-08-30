import React from 'react'
import styles from './host.css'

const host = ( props ) => {
	return (
		<div className={styles.host} onClick={props.selectGame}>
			<div>#{props.host.id}</div>
			<div className={styles.middle}>Name: {props.host.hostName}</div>
			<div>Players: {props.host.playerCount} / 4</div>
		</div>
	);
}

export default host

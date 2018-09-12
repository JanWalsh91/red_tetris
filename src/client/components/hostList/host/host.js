import React from 'react'
import styles from './host.css'

const host = ( props ) => {
	let classes = [];
	classes.push(styles.host);

	if (props.isSelected) {
		classes.push(styles.activeHost);
	}

	classes = classes.join(' ');
	return (
		<div className={classes} onClick={props.selectGame}>
			<div className={styles.hostID} >#{props.host.id}</div>
			<div className={styles.name}>Name: {props.host.hostName}</div>
			<div className={styles.players}>Players: {props.host.playerCount} / 4</div>
		</div>
	);
}

export default host

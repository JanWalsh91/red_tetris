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
			<div>#{props.host.id}</div>
			<div className={styles.middle}>Name: {props.host.hostName}</div>
			<div>Players: {props.host.playerCount} / 4</div>
		</div>
	);
}

export default host

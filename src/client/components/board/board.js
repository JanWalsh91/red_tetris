import React from 'react'
import styles from './board.css'

const board = ( props ) => {
	// socket.emit('server/ping', null);

	let content = <div>EMPTY BOARD</div>;


	// TODO: pass board isze info
	if (props.gameState) {
		console.log("found game state");
		content = props.gameState.map( row => {
			console.log("row: ", row);
			let line = row.map( cell => {
				return <div className={styles.cell}>{cell}</div>;
			});
			line = <div className={styles.row}>{line}</div>
			return line;
		})
	}

	return (
		<div className={styles.Board}>
			{content}
		</div>
	);
}

export default board

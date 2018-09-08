import React from 'react'
import styles from './board.css'

const board = ( props ) => {
	// socket.emit('server/ping', null);

	let content = <div>EMPTY BOARD</div>;

	let cellClasses = [];
	cellClasses.push(styles.cell);

	// TODO: pass board size info
	if (props.gameState) {
		content = props.gameState.map( row => {

			let line = row.map( cell => {
				let classes = [...cellClasses];
				classes.push(styles[cell]);
				classes = classes.join(' ');
				return <div className={classes}></div>;
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

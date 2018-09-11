import React from 'react'
import styles from './board.css'

const board = ( props ) => {
	// socket.emit('server/ping', null);

	let content = <div>EMPTY BOARD</div>;

	let cellClasses = [];
	cellClasses.push(styles.cell);

	// TODO: pass board size info
	if (props.gameState) {
		content = props.gameState.cells.map( (row, rIndex) => {

			let line = row.map( (cell, cIndex) => {
				let classes = [...cellClasses];
				classes.push(styles[cell]);
				classes = classes.join(' ');
				return <div key={(rIndex + 1) * (cIndex + 1)} className={classes}></div>;
			});
			line = <div key={rIndex} className={styles.row}>{line}</div>
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

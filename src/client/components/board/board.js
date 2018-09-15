import React from 'react'
import styles from './board.css'
import cellStyles from '../cell/cell.css'

const board = ( props ) => {
	let content = <div>EMPTY BOARD</div>;

	let cellClasses = [];
	cellClasses.push(cellStyles.cell);

	// TODO: pass board size info
	if (props.gameState && props.gameState.cells != undefined) {
		content = props.gameState.cells.map( (row, rIndex) => {

			let line = row.map( (cell, cIndex) => {
				let classes = [...cellClasses];
				classes.push(cellStyles[cell]);
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

import React from 'react'
import styles from './savedPiece.css'
import cellStyles from '../../cell/cell.css'

const savedPiece = ( props ) => {

	let cellClasses = [];
	cellClasses.push(cellStyles.cell);

	let cellContent = null;
	let rowContent = [];

	for (let y = 0; y < 4; y++) {
		cellContent = [];
		for (let x = 0; x < 4; x++) {
			let classes = [...cellClasses];

			if (props.piece && props.piece.cells && props.piece.cells[y] && props.piece.cells[y][x]) {
				classes.push(cellStyles[props.piece.cells[y][x]]);
			}
			classes = classes.join(' ');
			cellContent.push(<div key={(x + 1) * (y + 1)} className={classes}></div>);
		}
		rowContent.push(<div className={styles.row} key={y}>{cellContent}</div>);
	}

	return (
		<div className={styles.savedPiece}>
			{rowContent}
		</div>
	)
}

export default savedPiece

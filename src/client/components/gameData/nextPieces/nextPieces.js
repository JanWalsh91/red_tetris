import React from 'react'
import styles from './nextPieces.css'
import cellStyles from '../../cell/cell.css'

const nextPieces = ( props ) => {
	let cellClasses = [];
	cellClasses.push(cellStyles.cell);

	let cellContent = null;
	let rowContent = [];
	let pieces = [];

	for (let n = 0; n < 3; n++) {
		rowContent = [];
		for (let y = 0; y < 4; y++) {
			cellContent = [];
			for (let x = 0; x < 4; x++) {
				let classes = [...cellClasses];

				if (props.pieces && props.pieces[n] && props.pieces[n].cells && props.pieces[n].cells[y] && props.pieces[n].cells[y][x]) {
					classes.push(cellStyles[props.pieces[n].cells[y][x]]);
				}
				classes = classes.join(' ');
				cellContent.push(<div key={(x + 1) * (y + 1)} className={classes}></div>);
			}
			rowContent.push(<div key={y}>{cellContent}</div>);
		}
		pieces.push(<div className={styles.piece} key={n}>{rowContent}</div>)
	}

	return (
		<div className={styles.nextPieces}>
			{pieces}
		</div>
	)
}

export default nextPieces

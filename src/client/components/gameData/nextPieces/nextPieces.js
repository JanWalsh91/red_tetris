import React from 'react'
import styles from './nextPieces.css'
import cellStyles from '../../cell/cell.css'

const nextPieces = ( props ) => {
	console.log("GAME DATA =================");

	let cellClasses = [];
	cellClasses.push(cellStyles.cell);

	if (props.pieces) {
		let pieces = props.pieces.map( piece => {
			let pieceDOM = piece.cells.map( (row, rIndex) => {
				let line = row.map( (cell, cIndex) => {
					let classes = [...cellClasses];
					classes.push(cellStyles[cell]);
					classes = classes.join(' ');
					return <div key={(rIndex + 1) * (cIndex + 1)} className={classes}></div>;
				});
				line = <div key={rIndex} className={styles.row}>{line}</div>
				return line;
			});
			return pieceDOM;
		});

		return (
			<div className={styles.nextPieces}>
				{pieces}
			</div>
		)
	}

	return null;
}

export default nextPieces

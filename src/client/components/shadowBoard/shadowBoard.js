import React from 'react'
import styles from './shadowBoard.css'

const shadowBoard = ( props ) => {

	console.log("[ShadowBoard.js] shadowBoard");
	console.log(props);

	let content = <div>EMPTY BOARD</div>;
	let info = '';
	let shadowCellClasses = [];
	shadowCellClasses.push(styles.shadowCell);

	let contentArray = [];
	if (props.shadowState) {

		props.shadowState.forEach((shadowBoard, sbIndex) => {
			console.log(shadowBoard);

			// if (shadowBoard.id == props.playerUUID) return;
			let board = shadowBoard.board.map( (row, rIndex) => {
				let line = row.map( (cell, cIndex) => {

					// console.log(cell);

					let classes = [...shadowCellClasses];
					classes.push(styles[cell]);
					classes = classes.join(' ');

					return <div key={(rIndex + 1) * (cIndex + 1)} className={classes}></div>;
				});
				line = <div key={rIndex} className={styles.row}>{line}</div>
				return line;
			});

			contentArray.push(
				<div className={styles.shadowBoard} key={sbIndex} >
					<div className={styles.board}>
						{board}
					</div>
					<div className={styles.info}>
						<div className={styles.name} >{shadowBoard.name}</div>
						<div>Score: 40</div>
					</div>
				</div>
			);
		})
	}

	return (
		<div className={styles.ShadowBoards}>
			{contentArray}
		</div>
	);
}

export default shadowBoard

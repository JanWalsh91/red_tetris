import React from 'react'
import styles from './shadowBoard.css'

const shadowBoard = ( props ) => {

	console.log("[ShadowBoard.js] shadowBoard");

	let content = <div>EMPTY BOARD</div>;
	let info = '';
	let shadowCellClasses = [];
	shadowCellClasses.push(styles.shadowCell);

	let contentArray = [];
	if (props.shadowState) {
		props.shadowState.forEach((shadowBoard, sbIndex) => {
			if (shadowBoard.id == props.playerUUID) return;
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

			let fontSize = '100%';
			if (shadowBoard.name.length > 8) {
				fontSize = '60%';
			}

			contentArray.push(
				<div className={styles.shadowBoard} key={sbIndex} >
					<div className={styles.board}>
						{board}
					</div>
					<div className={styles.info}>
						<div className={styles.name} style={{fontSize: fontSize}}>{decodeURIComponent(shadowBoard.name)}</div>
						<div>Score: {shadowBoard.score}</div>
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

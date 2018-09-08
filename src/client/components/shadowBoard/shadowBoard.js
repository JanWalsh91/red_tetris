import React from 'react'
import styles from './shadowBoard.css'

const shadowBoard = ( props ) => {

	console.log("[ShadowBoard.js] shadowBoard");
	console.log(props);

	let content = <div>EMPTY BOARD</div>;
	let info = '';
	let shadowCellClasses = [];
	shadowCellClasses.push(styles.shadowCell);

	if (props.shadowState) {
		content = props.shadowState.board.map( row => {
			let line = row.map( cell => {

				// console.log(cell);

				let classes = [...shadowCellClasses];
				classes.push(styles[cell]);
				classes = classes.join(' ');

				return <div className={classes}></div>;
			});
			line = <div className={styles.row}>{line}</div>
			return line;
		})

		// Help, concatenate those variables ><
		info = (
			<div>{props.shadowState.name}</div>
		)
	}

	return (
		<div className={styles.shadowBoard}>
			{content}
			{info}
		</div>
	);
}

export default shadowBoard

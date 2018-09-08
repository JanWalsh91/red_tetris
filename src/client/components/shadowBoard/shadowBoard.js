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

		props.shadowState.forEach((shadowBoard) => {
			console.log(shadowBoard);

			contentArray.push(
				shadowBoard.board.map( row => {
					let line = row.map( cell => {

						// console.log(cell);

						let classes = [...shadowCellClasses];
						classes.push(styles[cell]);
						classes = classes.join(' ');

						return <div className={classes}></div>;
					});
					line = <div className={styles.row}>{line}</div>
					return line;
				}),
				<div>{shadowBoard.name}</div>
			);

			// Help, concatenate those variables ><
		})




	}

	return (
		<div className={styles.shadowBoard}>
			{contentArray}
			{info}
		</div>
	);
}

export default shadowBoard
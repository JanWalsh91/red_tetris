import React from 'react'
import styles from './gameData.css'
import NextPieces from './nextPieces/nextPieces'

const gameData = ( props ) => {
	console.log("GAME DATA =================");

	let cellClasses = [];
	cellClasses.push(styles.cell);

	let content = null;
	console.log(props.gameData)

	if (props.gameData) {
		return (
			<div className={styles.GameData}>
				<NextPieces pieces={props.gameData.nextPieces}/>
				<div className={styles.score}>Score: {props.gameData.score}</div>
				<div className={styles.level}>Level: {props.gameData.level + 1}</div>
				<div className={styles.removedLines}>Lines: {props.gameData.removedLines}</div>
			</div>
		)
	}

	return null;
}

export default gameData

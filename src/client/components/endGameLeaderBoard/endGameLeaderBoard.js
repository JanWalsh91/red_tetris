import React from 'react'
import styles from './endGameLeaderBoard.css'

const endGameLeaderBoard = ( props ) => {
	let leaderBoard = null;
	let sortedPlayers = null;

	// console.log("props: ", props);
	if (props.playersInfo && props.playersInfo.size > 0) {
		sortedPlayers = [...props.playersInfo.values()].sort((a, b) => {
			return b.score - a.score;
		});

		let winnerByScore = null;
		if (props.isWinnerByScore && sortedPlayers.length > 1) {
			winnerByScore = (
				<span>*</span>
			)
		}

		leaderBoard = sortedPlayers.map( player => {
			let playerName = null;

			if (winnerByScore && player.id == props.uuid) {
				playerName = "*" + player.name
			} else {
				playerName = player.name
			}
			return (
				<div key={player.id} className={styles.rankPosition}>
					<span>{playerName}</span>
					<span>{player.score}</span>
				</div>
			)
		})

		leaderBoard = (
			<div className={styles.scoreRanking}>
				<h3>Score</h3>
				{leaderBoard}
			</div>
		);
	}

	let status = null;
	if (!sortedPlayers || sortedPlayers.length == 1 || props.isWinner == false) {
		status = <h2>You lose...</h2>
	} else {
		status = <h2>You win!</h2>
	}

	return (
		<div className={styles.endGameLeaderBoard}>
			{status}
			{leaderBoard}
		</div>
	);
}

export default endGameLeaderBoard

import React from 'react'
import styles from './endGameLeaderBoard.css'

const endGameLeaderBoard = ( props ) => {

	let sortedPlayers = [...props.playersInfo.values()].sort((a, b) => {
		return b.score - a.score;
	});

	let winnerByScore = null;
	if (props.isWinnerByScore && sortedPlayers.length > 1) {
		winnerByScore = (
			<span>*</span>
		)
	}

	let leaderBoard = sortedPlayers.map( player => {
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

	let status = null;
	if (sortedPlayers.length == 1 || props.isWinner == false) {
		status = <h2>You loose...</h2>
	} else {
		status = <h2>You win!</h2>
	}


	let winnerContent = (
		<div className={styles.endGameScoreLayout}>
			{status}
			<div className={styles.scoreRanking}>
				<h3>Score</h3>
				{leaderBoard}
			</div>

		</div>
	)

	return (
		<div>
			{winnerContent}
		</div>
	);
}

export default endGameLeaderBoard

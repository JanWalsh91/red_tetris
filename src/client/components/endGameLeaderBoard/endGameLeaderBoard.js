import React from 'react'
import styles from './endGameLeaderBoard.css'

const endGameLeaderBoard = ( props ) => {
	let leaderBoard = null;

	if (props.playersLostList != undefined && props.playersInfo != undefined && props.playersInfo.size > 0) {
		let bestScore = Math.max.apply(Math, [...props.playersInfo.values()].map( o => o.score ));

		leaderBoard = props.playersLostList.map( uuid => {
			let player = props.playersInfo.get(uuid);
			let playerName = ((player.score == bestScore) ? '*' : '') + player.name;

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
	if (props.playersLostList != undefined && props.playersLostList.length == 1 || props.isWinner == false) {
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

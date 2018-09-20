import React from 'react'
import styles from './leaderBoard.css'

const leaderBoard = ( props ) => {

	let leaderBoard = null;
	if (props.players) {
		leaderBoard = props.players.map( (player, index) => {
			return (
				<div key={index} className={styles.rankingRow}>
					<span>{player.playerName}</span>
					<span>{player.score}</span>
				</div>
			)
		})
	}

	return (
		<div className={styles.LeaderBoard}>
			<h3>Leader Board</h3>
			<div className={styles.ranking}>
				{leaderBoard}
			</div>
		</div>
	);
}

export default leaderBoard

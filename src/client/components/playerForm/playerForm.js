import React from 'react'
import { connect } from 'react-redux'
import styles from './playerForm.css'

const PlayerForm = ( props ) => {

	const keyboardEvent = (event) => {
		if (event.keyCode == 13) {
			props.onUpdateName();
		}
	}

	return (
		<div className={styles.playerForm}>
			<input onKeyDown={keyboardEvent} type="text" id="playerInputName" placeholder="Enter your username" />
			<input id="buttonPlayerInputName" value="Play" type="button" onClick={props.onUpdateName} />
		</div>
	)
}

export default PlayerForm

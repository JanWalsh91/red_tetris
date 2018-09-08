import React from 'react'
import { connect } from 'react-redux'
import styles from './playerForm.css'

const PlayerForm = ( props ) => {

	const keyboardEvent = (event) => {
		if (event.keyCode == 13) {
			document.getElementById('buttonPlayerInputName').click();
		}
	}

	return (
		<div className={styles.playerForm}>
			<input onKeyDown={keyboardEvent} type="text" id="playerInputName" />
			<br/>
			<input id="buttonPlayerInputName" value="Play" type="button" onClick={props.onUpdateName} />
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		// hostList: state.hostList
	}
}

// const mapDispatchToProps = dispatch => {
// 	return {
// 		// onClick: () => {dispatch(pingServer())}
// 	}
// }

export default PlayerForm

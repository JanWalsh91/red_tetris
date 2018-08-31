import React from 'react'
import { connect } from 'react-redux'
import styles from './playerForm.css'

const PlayerForm = ( props ) => {

	return (
		<div className={styles.playerForm}>
			<input type="text" id="playerInputName" />
			<br/>
			<input value="FUN" type="button" onClick={props.onUpdateName} />
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

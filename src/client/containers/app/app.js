import React from 'react'
import { connect } from 'react-redux'
import styles from './app.css'
import Button from '../../components/button/button'
import HeaderBar from '../../components/headerBar/headerBar'
import Main from './main/main'
import {alert} from '../../actions/client'
import {pingServer} from '../../actions/server'
// import {store} from '../../index'
import {socket} from '../../socket'
import * as ActionNames from '../../../server/serverActions'


const App = (props) => {

	const keyboardEvent = (event) => {


		if (props.gameJoined) {
			if (event.keyCode == 37) {
				socket.emit(ActionNames.SEND_GAME_ACTION, "left");
			}
		} else {
			console.log("Let's not to be played");
		}

	}


	return (
		<div className={styles.app} tabIndex="0"  onKeyDown={keyboardEvent}>
			<HeaderBar></HeaderBar>
			<Main></Main>
			<br/>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		gameJoined: state.gameJoined

	}
}

export default connect(mapStateToProps, null)(App)

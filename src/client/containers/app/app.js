import React from 'react'
import { connect } from 'react-redux'
import styles from './app.css'
import Button from '../../components/button/button'
import HeaderBar from '../../components/headerBar/headerBar'
import Main from './main/main'
import {alert} from '../../actions/client'
import {pingServer} from '../../actions/server'
// import {store} from '../../index'
import socket from '../../socket'
import * as ActionNames from '../../../server/serverActions'


const App = (props) => {

	let canMove = true;

	const keyboardEvent = (event) => {
		if (!canMove) return ;
		canMove = false;
		setTimeout(function() { canMove = true; }, 100);
		console.log(event.keyCode);
		if (props.gameJoined) {
			// console.log("props.gameJoined");
			event.preventDefault();
			switch (event.keyCode) {
				case 32:
					socket.emit(ActionNames.SEND_GAME_ACTION, "downShortcut");
					break;
				case 37:
					socket.emit(ActionNames.SEND_GAME_ACTION, "left");
					break;
				case 38:
					socket.emit(ActionNames.SEND_GAME_ACTION, "rotate");
					break;
				case 39:
					socket.emit(ActionNames.SEND_GAME_ACTION, "right");
					break;
				case 40:
					socket.emit(ActionNames.SEND_GAME_ACTION, "down");
					break;
				default:
					break ;
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

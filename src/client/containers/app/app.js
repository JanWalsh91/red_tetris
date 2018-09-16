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

	// const keyboardEvent = (event) => {
	// 	if (!canMove) {
	// 		return ;
	// 	}
	// 	canMove = false;
	// 	setTimeout(function() { canMove = true; }, 25);
	// 	if (props.gameJoined) {
	// 		// event.preventDefault();
	// 		switch (event.keyCode) {
	// 			case 32:
	// 				socket.emit(ActionNames.SEND_GAME_ACTION, "downShortcut");
	// 				break;
	// 			case 37:
	// 				socket.emit(ActionNames.SEND_GAME_ACTION, "left");
	// 				break;
	// 			case 38:
	// 				socket.emit(ActionNames.SEND_GAME_ACTION, "rotate");
	// 				break;
	// 			case 39:
	// 				socket.emit(ActionNames.SEND_GAME_ACTION, "right");
	// 				break;
	// 			case 40:
	// 				socket.emit(ActionNames.SEND_GAME_ACTION, "down");
	// 				break;
	// 			case 48:
	// 			case 96:
	// 				socket.emit(ActionNames.SEND_GAME_ACTION, "savePiece")
	// 			default:
	// 				break ;
	// 		}
	// 	}
	// }

	function KeyboardController(keys, repeat) {

		var timers = {};
		var locked = {};

		var lockedKey = [38, 32, 48, 96];

		document.body.onkeydown = (event) => {
			if (props.gameJoined) {
				let key = event.keyCode;
				console.log(key in keys);
				if (!(key in keys)) {
					return true;
				}
				if (lockedKey.includes(key)) {
					if (!(key in locked)) {
						keys[key]();
						locked[key] = key;
					}
				} else if (!(key in timers)) {
					timers[key] = null;
					keys[key]();
					if (repeat !== 0) {
						timers[key] = setInterval(keys[key], repeat);
					}
				}
			}
		}

		document.onkeyup = function(event) {
			let key = event.keyCode;
			if (key in timers) {
				if (timers[key] != null) {
					clearInterval(timers[key]);
					delete timers[key];
				}
			}
			else if (key in locked) {
				delete locked[key];
			}
		}
	}

	KeyboardController({
		32: function() { socket.emit(ActionNames.SEND_GAME_ACTION, "downShortcut") },
    	37: function() { socket.emit(ActionNames.SEND_GAME_ACTION, "left") },
    	38: function() { socket.emit(ActionNames.SEND_GAME_ACTION, "rotate") },
    	39: function() { socket.emit(ActionNames.SEND_GAME_ACTION, "right") },
    	40: function() { socket.emit(ActionNames.SEND_GAME_ACTION, "down") },
		48: function() { socket.emit(ActionNames.SEND_GAME_ACTION, "savePiece") },
		96: function() { socket.emit(ActionNames.SEND_GAME_ACTION, "savePiece") }

	}, 125);

	// const keyboardEvent = (event) => {
	// 	if (props.gameJoined) {
	//
	// 		switch (event.keyCode) {
	// 			case 32:
	// 				socket.emit(ActionNames.SEND_GAME_ACTION, "downShortcut");
	// 				break;
	// 			case 37:
	// 				socket.emit(ActionNames.SEND_GAME_ACTION, "left");
	// 				break;
	// 			case 38:
	// 				socket.emit(ActionNames.SEND_GAME_ACTION, "rotate");
	// 				break;
	// 			case 39:
	// 				socket.emit(ActionNames.SEND_GAME_ACTION, "right");
	// 				break;
	// 			case 40:
	// 				socket.emit(ActionNames.SEND_GAME_ACTION, "down");
	// 				break;
	// 			case 48:
	// 			case 96:
	// 				socket.emit(ActionNames.SEND_GAME_ACTION, "savePiece")
	// 			default:
	// 				break ;
	// 		}
	// 	}
	// }

	if (props.errorMessage) {

		return (
			<span>ERROR : {props.errorMessage}</span>
		)

	}

	return (
		<div className={styles.app} tabIndex="0">
			<HeaderBar></HeaderBar>
			<Main></Main>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		gameJoined: state.gameJoined,
		errorMessage: state.errorMessage

	}
}

export default connect(mapStateToProps, null)(App)

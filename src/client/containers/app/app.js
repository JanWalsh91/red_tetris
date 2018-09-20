import React from 'react'
import { connect } from 'react-redux'
import styles from './app.css'
import Button from '../../components/button/button'
import HeaderBar from '../../components/headerBar/headerBar'
import Instructions from '../../components/instructions/instructions'
import Main from './main/main'
import Modal from '../../components/Modal/Modal'
import {alert} from '../../actions/client'

import * as ActionNames from '../../../server/serverActions'
import {serverGameAction} from '../../actions/server'

import {toggleInstructions} from '../../actions/client'

const App = (props) => {

	function KeyboardController(keys, repeat) {
		var timers = {};
		var locked = {};

		var lockedKey = [38, 32, 48, 96];

		document.onkeydown = (event) => {
			if (props.gameJoined) {
				let key = event.keyCode;
				if (!(key in keys) || !repeat) {
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
					timers[key] = setInterval(keys[key], repeat);
				}
			}
		};

		document.onkeyup = (event) => {
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
		};
	}

	KeyboardController({
		32: function() { props.serverGameAction("downShortcut") },
    	37: function() { props.serverGameAction("left") },
    	38: function() { props.serverGameAction("rotate") },
    	39: function() { props.serverGameAction("right") },
    	40: function() { props.serverGameAction("down") },
		48: function() { props.serverGameAction("savePiece") },
		96: function() { props.serverGameAction("savePiece") }

	}, 125);

	if (props.errorMessage) {
		return (
			<div className={styles.error}>
				<span>ERROR : {props.errorMessage}</span>
			</div>
		)
	}

	let instructions = null;

	if (props.showInstructions) {
		instructions = (
			<Instructions />
		)
	}

	return (
		<div className={styles.app} tabIndex="0">
			<HeaderBar></HeaderBar>
			<Main></Main>
			<Button value="i" onClick={props.toggleInstructions}/>
			<Modal show={props.showInstructions} modalClosed={props.toggleInstructions}>
				{instructions}
			</Modal>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		gameJoined: state.gameJoined,
		errorMessage: state.errorMessage,
		showInstructions: state.showInstructions
	}
}

const mapDispatchToProps = dispatch => {
	return {
		toggleInstructions: () => dispatch(toggleInstructions()),
		serverGameAction: gameAction => dispatch(serverGameAction(gameAction))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

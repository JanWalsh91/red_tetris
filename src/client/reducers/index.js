import { ALERT_POP, UPDATE_HOST_LIST } from '../actions/client'
import { PING_SERVER } from '../actions/server'

import socket from '../socket'

// import io from 'socket-io'

const alertPop = (state, action) => {
	console.log("ALERT_POP dispatched");
	return {
		...state,
		message: action.message
	}
}

const pingServer = (state, action) => {
	console.log("pingServer reducer");

	socket.emit('action', {type: 'server/ping'});

	return dispatch => {
		setTimeout(() => {
			// Yay! Can invoke sync or async actions with `dispatch`
			console.log("Ici apres 5s");
			dispatch(alertPop("Je"));
		}, 1000);
	};
}

const updateHostList = (state, action) => {
	console.log("updateHostList reducer");

	return {
		...state,
		hostList: action.hostList
	};
}

// const selectGame = (state, action) => {
// 	console.log("selectGame");
//
// 	return {
//
// 	}
// }

const reducer = (state = {} , action) => {
	console.log("reducer action type: ", action.type);
	switch(action.type) {
		case ALERT_POP: return alertPop(state, action);
		case PING_SERVER: return pingServer(state, action);
		case UPDATE_HOST_LIST: return updateHostList(state, action);
		// case SELECT_GAME: return selectGame(state, action);
		default: console.log('default'); return state;
	}
}

export default reducer

import { ALERT_POP } from '../actions/client'
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

const reducer = (state = {} , action) => {
	switch(action.type) {
		case ALERT_POP: return alertPop(state, action);
		case PING_SERVER: return pingServer(state, action);
		default: return state;
	}
}

export default reducer

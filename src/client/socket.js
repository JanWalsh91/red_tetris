import io from 'socket.io-client'
import params from '../../params'

import store from './index'
import {alert, updateHostList, updateGameJoined} from './actions/client'

import * as ActionNames from '../server/serverActions'

const socket = io.connect(params.server.getUrl())

socket.on('action', (action) => {

	console.log(action);
	console.log(action.type);

	if (action.type === 'pong') {
		console.log("it works!!!!!!!!!!??");
		console.log(store)

		store.dispatch(alert("Coucou les loulous"))

	}
})

socket.on(ActionNames.UPDATE_HOST_LIST, (hostList) => {
	console.log("[socket.js] recieved by client:",  hostList);

	// dispatch redux action
	store.dispatch(updateHostList(hostList));
})

socket.on(ActionNames.UPDATE_GAME_JOINED, () => {
	store.dispatch(updateGameJoined(true))
})

module.exports = socket

// socket.emit(ActionNames.ADD_NEW_PLAYER_TO_LOBBY, "toto");

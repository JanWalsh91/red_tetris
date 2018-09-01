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

socket.on(ActionNames.SERVER_INFO, (serverInfo) => {
	console.log("recieved by client:",  serverInfo);

	// dispatch redux action
	store.dispatch(updateHostList(serverInfo));
})

socket.on(ActionNames.GAME_JOINED, () => {

	store.dispatch(updateGameJoined(true))

})

module.exports = socket

// socket.emit(ActionNames.NEW_PLAYER, "toto");

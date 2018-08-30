import io from 'socket.io-client'
import params from '../../params'

import store from './index'
import {alert, updateHostList} from './actions/client'

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

socket.on('serverInfo', (serverInfo) => {
	console.log("recieved by client:",  serverInfo);

	// dispatch redux action
	store.dispatch(updateHostList(serverInfo));
})

module.exports = socket

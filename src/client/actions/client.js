export const ALERT_POP = 'ALERT_POP'

export const alert = (message) => {
	console.log("creating alert");
	return {
		type: ALERT_POP,
		message
	}
}

export const UPDATE_HOST_LIST = 'UPDATE_HOST_LIST'

export const updateHostList = ( hostList ) => {
	console.log("updateHostList");
	return {
		type: UPDATE_HOST_LIST,
		hostList: hostList
	}
}

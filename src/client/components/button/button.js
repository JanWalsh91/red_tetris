import React from 'react'
import styles from './button.css'

const button = ( props ) => {
	// socket.emit('server/ping', null);

	return (
		<button onClick={props.onClick}>{props.value}</button>
	);
}

export default button

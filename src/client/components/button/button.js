import React from 'react'
import styles from './button.css'

const button = ( props ) => {
	// socket.emit('server/ping', null);

	return (
		<button
			onClick={props.onClick}>
		</button>
	);
}

export default button

import React from 'react'
import styles from './button.css'

const button = ( props ) => {
	return (
		<input type="button" className={styles.Button} onClick={props.onClick} value={props.value}/>
	);
}

export default button

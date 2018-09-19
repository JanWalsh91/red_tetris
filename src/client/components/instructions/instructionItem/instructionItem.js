import React from 'react'
import styles from './instructionItem.css'

const instructionItem = ( props ) => {
	if (props.instruction == undefined || props.instruction.name == undefined || props.instruction.instruction == undefined)
		return null;
	return (
		<div className={styles.InstructionItem}>
			<div className={styles.name}>{props.instruction.name}</div>
			<div className={styles.instruction}>{props.instruction.instruction}</div>
		</div>
	);
}

export default instructionItem

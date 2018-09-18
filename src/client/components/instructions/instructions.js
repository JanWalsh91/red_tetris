import React from 'react'
import styles from './Instructions.css'

import InstructionItem from './instructionItem/instructionItem'

const instructions = () => {

	const list = [
		{
			name: 'space',
			instruction: 'Hard drop'
		},
		{
			name: '↑',
			instruction: 'Rotate'
		},
		{
			name: '←',
			instruction: 'Move left'
		},
		{
			name: '→',
			instruction: 'Move right'
		},
		{
			name: '↓',
			instruction: 'Soft drop'
		},
		{
			name: '0',
			instruction: 'Hold piece'
		}
	]

	let instructionsList = [];
	instructionsList = list.map( instruction => {
		return <InstructionItem key={instruction.name} instruction={instruction}/>
	});

	instructionsList = (
		<div className={styles.instructionlist}>
			{instructionsList}
		</div>
	);

	return (
		<div className={styles.Instructions}>
			<h3>Instructions</h3>
			{instructionsList}
		</div>
	);
}

export default instructions

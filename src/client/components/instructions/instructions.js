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
			instruction: 'rotate'
		},
		{
			name: '←',
			instruction: 'move left'
		},
		{
			name: '→',
			instruction: 'move right'
		},
		{
			name: '↓',
			instruction: 'Soft drop'
		},
		{
			name: '0',
			instruction: 'hold piece'
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

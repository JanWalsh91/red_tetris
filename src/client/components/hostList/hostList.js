import React from 'react'
import styles from './hostList.css'
import Host from './host/host'
import Button from '../button/button'

import * as ActionNames from '../../../server/serverActions'

const hostList = ( props ) => {

	let content = null;

	let button = null;
		if (props.gameSelected != null && props.hostList.find(el => el.id == props.gameSelected )) {
			button = (
				<Button onClick={ () => props.joinGame(props.gameSelected)} type='button'
					value={"JOIN GAME #" + props.gameSelected}
				/>
			)
		} else {
			button = (
				<Button onClick={props.createGame} type='button'
					value={"CREATE GAME"}
				/>
			)
		}


	if (props.hostList) {
		content = props.hostList.map( host => {
			return <Host
				key={host.id}
				host={host}
				selectGame={() => props.onSelectGame(host.id)}
				isSelected={host.id == props.gameSelected}
			/>;
		});
	}

	return (
		<div className={styles.hostList}>
			<div className={styles.list}>
				{content}
			</div>
			{button}
		</div>
	)
}

export default hostList

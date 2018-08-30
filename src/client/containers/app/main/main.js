import React from 'react'
import { connect } from 'react-redux'
import styles from './main.css'
import HostList from '../../../components/hostList/hostList'

const Main = ( props ) => {

	return (
		<div className={styles.main}>
			<HostList hostList={props.hostList}> </HostList>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		hostList: state.hostList
	}
}

// const mapDispatchToProps = dispatch => {
// 	return {
// 		// onClick: () => {dispatch(pingServer())}
// 	}
// }

export default connect(mapStateToProps, null)(Main)

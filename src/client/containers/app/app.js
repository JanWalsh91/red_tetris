import React from 'react'
import { connect } from 'react-redux'
import styles from './app.css'
import Button from '../../components/button/button'
import HeaderBar from '../../components/headerBar/headerBar'
import Main from './main/main'
import {alert} from '../../actions/client'
import {pingServer} from '../../actions/server'
// import {store} from '../../index'

const App = ({message, onClick}) => {
	return (
		<div className={styles.app}>
			<HeaderBar></HeaderBar>
			<Main></Main>
			<span>{message}</span>
			<span>Test</span>
			<Button onClick={() => onClick()}></Button>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		message: state.message
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onClick: () => {dispatch(pingServer())}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

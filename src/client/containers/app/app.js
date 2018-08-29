import React from 'react'
import { connect } from 'react-redux'
import styles from './app.css'
import Button from '../../components/button/button'
import {alert} from '../../actions/alert'
import {store} from '../../index'

const App = ({message, onClick}) => {
  return (
    <div className={styles.app}>
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
  console.log("mapping\n");
  return {
    onClick: () => {dispatch(alert("Patate"))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

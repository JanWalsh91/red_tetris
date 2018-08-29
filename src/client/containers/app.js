import React from 'react'
import { connect } from 'react-redux'
import styles from './app.css'

const App = ({message}) => {
  return (
    <div className={styles.app}>
      <span>{message}</span>
      <span>Test</span>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    message: state.message
  }
}
export default connect(mapStateToProps, null)(App)

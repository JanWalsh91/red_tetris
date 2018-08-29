import { ALERT_POP } from '../actions/alert'

const reducer = (state = {} , action) => {
  switch(action.type){
    case ALERT_POP:
      console.log("ALERT_POP dispatched");
      return { message: action.message }
    default:
      return state
  }
}

export default reducer

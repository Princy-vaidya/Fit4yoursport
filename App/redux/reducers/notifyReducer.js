import * as ActionTypes from '../actionTypes';

const initState = {
  userDetails: {
    notification: " "
  }
}

const notifyReducer = (state = initState, action) => {
  switch (action.type) {
    case ActionTypes.SAVE_NOTIFICATION:
        return { 
          ...state, 
          userDetails: action.userDetails }
    
    default:
      return state;
  }
}

export default notifyReducer;
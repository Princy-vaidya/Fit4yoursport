import * as ActionTypes from '../actionTypes';

const initState = {
  userDetails: {
   token: ""
  }
}

const tokenReducer = (state = initState, action) => {
  switch (action.type) {
    case ActionTypes.SAVE_TOKEN:
        return { 
          ...state, 
          userDetails: action.userDetails }
    
    default:
      return state;
  }
}

export default tokenReducer;
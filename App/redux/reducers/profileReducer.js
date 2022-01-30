import * as ActionTypes from '../actionTypes';

const initState = {
  userDetails: {
    profileImage: ' ',
  },
};

const profileReducer = (state = initState, action) => {
  switch (action.type) {
    case ActionTypes.SAVE_PROFILE_PIC:
      console.log('action',action)
      return {
        ...state,

        userDetails: {...state.userDetails, profileImage: action.userDetails.profileImage},
      };
    default:
      return state;
  }
};

export default profileReducer;

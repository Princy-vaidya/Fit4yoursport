
import * as ActionTypes from '../actionTypes';
// action with type & payload
export const saveUserProfile = (userDetails) => {
  return {
    type:ActionTypes.SAVE_PROFILE_PIC,
    userDetails:{
      profileImage: userDetails.profileImage
    }
  }
}

import * as ActionTypes from '../actionTypes';
// action with type & payload
export const saveUserNotification = (userDetails) => {
  return {
    type:ActionTypes.SAVE_NOTIFICATION,
    userDetails:{
        notification: userDetails.notification
    }
  }
}
import * as ActionTypes from '../actionTypes';
import { getToken } from '../../Utils/Preference'

export const saveToken = () => (dispatch) => { // app intiial loading
  // asyncstorage -> token;
  getToken().then( Token => {
    
    if (Token) {
      dispatch( {
        type: 'SAVE_TOKEN',
        userDetails: {
          token: Token
        }
      })
    } else {
       dispatch({
        type: 'SAVE_TOKEN',
        userDetails: {
          token: ''
        }
      })
    }
    
  })
  

}


// export const loginApi = (obj) => { // login button execute
//   //login api (obj)
//   // async storage 
//   // return {
//  //   type: 'SAVE_TOKEN',
//     //userDetails:{
//       //token: userDetails.token
//    // }
//  // }

// }
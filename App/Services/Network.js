// import NetInfo from '@react-native-community/netinfo';
import {base_url} from '../Utils/constants';
import axios from 'axios';
import Toast from 'react-native-root-toast';

export default Network = (endpoint, method, body, authtoken) => {
  console.log(JSON.stringify(body));
  console.log('URL ', `${base_url}${endpoint}`);
  console.log('Token ', JSON.stringify(authtoken));

  return new Promise((resolve, reject) => {
    // NetInfo.fetch().then((state) => {
    //   if (state.isConnected) {
        axios({
          method,
          url: `${base_url}${endpoint}`,
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': authtoken,
          },
          data: body,
        })
          .then(function (res) {
            resolve(res.data);
          })
          .catch(function (error) {
            console.log(error);
            Toast.show('Something went wrong. Please try again !');
            reject(error);
          });
    //   } else {
    //     reject('No connection');
    //     Toast.show('Please check your internet connection !', {
    //       duration: Toast.durations.LONG,
    //       position: Toast.positions.BOTTOM,
    //     });
    //   }
    // });
  });
};

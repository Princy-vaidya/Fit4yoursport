import React,{useMemo,useReducer} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {createAction} from './createAction';
import {sleep} from './sleep';
import Network from '../Services/Network';
import {getDeviceToken} from '../Utils/Preference'

export function useAuth() {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_USER':
          return {
            ...state,
            user: {...action.payload},
          };
        case 'REMOVE_USER':
          return {
            ...state,
            user: undefined,
          };
        case 'SET_LOADING':
          return {
            ...state,
            loading: action.payload,
          };
        default:
          return state;
      }
    },
    {
      user: undefined,
      loading: true,
    },
  );

  const auth = useMemo(
    () => ({
      login: async (email, password) => {
         Network('/login', 'post', {
        email:email,
        password: password,
        devicetoken: await getDeviceToken(),
        apptype: Platform.OS
        }).then(async (data) => {
         
        const user = {
          // email: data.user.email,
          token: data.response_data.authtoken,
          userType:data.response_data.user_type
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(user));
      
        dispatch(createAction('SET_USER', user));
        console.log('kkl', await AsyncStorage.getItem('user'))})
      },
      logout: async () => {
        await AsyncStorage.removeItem('user');
        dispatch(createAction('REMOVE_USER'));
      },
      register: async (email,fname,lname, password,phone_no,countryCode) => {
        await sleep(2000);
        Network('/register', 'post', {
          email:email,
        fname: fname,
        lname: lname,
        password: password,
        phone_no: phone_no,
        country_code: countryCode,
        // email_verify: 'yes',
        apptype: 'ANDROID',
        });
      },
    }),
    [],
  );
  React.useEffect(() => {
    sleep(2000).then(() => {
    const user= AsyncStorage.getItem('user').then(user => {
        if (user) {
          dispatch(createAction('SET_USER', JSON.parse(user)));
        }
        dispatch(createAction('SET_LOADING', false));
      });
      // console.log('user',user)
    });
  
  }, []);
  return {auth, state};
}

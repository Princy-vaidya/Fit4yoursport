import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {COLORS, HEIGHT, WIDTH} from '../../Utils/constants';
import DashboardView from './DashboardView';
import Header from '../../Utils/Header';
import Pedometer, {
  PedometerInterface,
} from '@t2tx/react-native-universal-pedometer';
import {getToken, getUserId,getUserType,setNotifyCount} from '../../Utils/Preference';
import { saveUserNotification } from '../../redux/actions/saveNotifyAction'
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

 function Dashboard({navigation}) {
  const {userToken, setUserToken} = useState('');
  const {userId, setUserId} = useState('');

 


  useFocusEffect(
    React.useCallback(() => {
      getUserToken();
      getNotification();
    }, []),
  );

  const getNotification=async()=>{
    const id = await getUserId()
    const token = await getToken();
    const userType = await getUserType();

    const endUrl=userType==='user'?
    `/user-notification-list?user_id=${id}&page =1&limit=20`:
    `/user-notification-list?trainer_id=${id}&user_id=${route.params.userId}&page =1&limit=20`

  
    Network(endUrl, 'get', '', token)
      .then(async function (response) {
        let notify=response.response_data.total_unread_msg;
      //  await setNotifyCount(notify)
        
        var userDetails = {};
        userDetails.notification = response.response_data.total_unread_msg
         saveUserNotification(userDetails)
      })
      .catch(function (error) {
        
        console.log(JSON.stringify(error));
      });
  }
  const getUserToken = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();
      setUserToken(token);
      setUserId(id);
    } catch (e) {}
  };

  const checkStepCountAvailable = () => {
    Pedometer.isStepCountingAvailable((error, result) => {
      console.log(error, result);
      startCounting();
    });
  };

  const startCounting = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();

    Pedometer.queryPedometerDataBetweenDates(
      start.getTime(),
      end.getTime(),
      (error, data) => {
        setInterval(async () => {
          updateStepCountOnServer(data);
        }, 60 * 1000);
      },
    );
  };

  const updateStepCountOnServer = async (data) => {
    // console.warn('NNNN   ', data);
    let formData = new FormData();
    formData.append('exercise_name', 'Walk');
    formData.append('user_id', userId);
    formData.append('time', '30 min');
    formData.append('duration', RepsName);
    formData.append('calories_burned', RepsName);
    formData.append('steps', data.steps);
    formData.append('km', data.km);

    startCounting();
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
    {/* <View style={{flex: 1, backgroundColor: 'white'}}> */}
    <Header
          navigation={navigation}
          title='Dashboard'
          type='menu'
          onPress={navigation}
       />
      <View style={{backgroundColor: 'white', height: 0.5}} />
      <Text
        style={{
          fontSize: 18,
          color: COLORS.GRAY,
          marginTop: 20,
          marginStart:30,
        }}>
        Status Today
      </Text> 
     
      <DashboardView navigation={navigation} />
    {/* </View> */}
    </SafeAreaView>
  );
}

export default connect(null,{saveUserNotification})(Dashboard);
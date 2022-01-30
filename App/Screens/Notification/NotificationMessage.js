import React,{useEffect,useState} from 'react';
import {LogBox,Alert,StatusBar,View} from 'react-native';
import {setDeviceToken,getToken,setNotifyCount,getUserId,getUserType} from '../../Utils/Preference'
import FlashMessage,{ showMessage, hideMessage } from "react-native-flash-message";
import { COLORS } from '../../Utils/constants';
import messaging from '@react-native-firebase/messaging';
import * as NotifyNavigator from './NotifyNavigator';



const NotificationMessage = (props) => {

  const[notification,setNotification]=useState(false);
  const[notificationTrainer,setNotificationTrainer]=useState(false)

  const[type,setType]=useState(false)

 


  useEffect(() => {
      requestUserPermission();

      messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      const userType=await getUserType();
      setType(userType)
      if(userType==='user' && remoteMessage.notification.title==='Goal Added By Trainer' ){
      setNotification(true)
       showMessage({
       message:remoteMessage.notification.title,
       description:remoteMessage.notification.body,
       type: "info"
      });   
    }else{
      setNotificationTrainer(true)
      showMessage({
      message:remoteMessage.notification.title,
      description:remoteMessage.notification.body,
      type: "info"
     });   
    }
    });

   getNotify();
   }, []);


   const getNotify= async()=>{
    const id = await getUserId()
    const token = await getToken()
    

    Network(`/user-notification-list?user_id=${id}&page =1&limit=20`, 'get', '', token)
      .then(async function (response) {
        console.log('notify', JSON.stringify(response));
        // alert(response.response_data.total_unread_msg)
        //  alert(response.response_data.total_unread_msg)
        console.log('nnnotify',response.response_data.total_unread_msg)
        let notify=(response.response_data.total_unread_msg);
      //  await setNotifyCount(notify)
      
       
         })
     
      .catch(function (error) {
        
        console.log(JSON.stringify(error));
      });

    
    // return unsubscribe;
   }


 const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken() 
      console.log('Authorization status:', authStatus);
    }

    const userType=await getUserType();
    setType(userType)
  }


 const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
     console.log(fcmToken);
     console.log("Your Firebase Token is:", fcmToken);
     setDeviceToken(fcmToken)
    } else {
     console.log("Failed", "No token received");
    }

   
  }


if(notification && type==='user'){

  return (
       <FlashMessage 
         position="top" 
         animated={true} 
         autoHide={false} 
         style={{backgroundColor:COLORS.GRAY}}
         onPress={()=>
         NotifyNavigator.navigate('MyGoal')
        }
         />
     );
      }
      else{
        return(
          <FlashMessage 
          position="top" 
          animated={true} 
          autoHide={false} 
          style={{backgroundColor:COLORS.GRAY}}
          onPress={()=>
          NotifyNavigator.navigate('TrainerDashboard')
         }/>
        )
     }
      
};

LogBox.ignoreAllLogs();

export default NotificationMessage;

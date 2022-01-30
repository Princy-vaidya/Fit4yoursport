import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Dimensions, Image} from 'react-native';
import {HEIGHT, GAP, COLORS, FONT} from '../../Utils/constants';
import {getToken, getUserId, setSessionKey,getUserType} from '../../Utils/Preference';
import ProgressCircle from 'react-native-progress-circle';
import Loader from '../../Components/Common/Loader';
import {useFocusEffect} from '@react-navigation/native';
import { renderComponent } from 'recompose';
import Network from '../../Services/Network';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// const leftImage1 = require('../../Assets/Auths/Ellipse.png');
// const centerImage1 = require('../../Assets/Auths/Ellipse.png');

export default function DashboardView(props) {
  const {navigation}=props;
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [userStep, setUserStep] = useState({Walking_data: {total_steps: '0'}});
  const [userCalories, setUserCalories] = useState({total_calories: '0'});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');



  useFocusEffect(
    React.useCallback(() => {
      getUserStep();
      token()
    }, []),
  );

 

  const token = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();
      setAuthToken(token);
      setUserId(id);
    

      getUserCalories(token);
    } catch (e) {}
  };


  const getNotification=async()=>{
    const id = await getUserId()
    const token = await getToken();
    const userType = await getUserType();

    const endUrl=userType==='user'?
    `/user-notification-list?user_id=${id}&page =1&limit=20`:
    `/user-notification-list?trainer_id=${id}&user_id=${route.params.userId}&page =1&limit=20`

  
    Network(endUrl, 'get', '', token)
      .then(async function (response) {
        let notify=(response.response_data.total_unread_msg);
        // await setNotifyCount(notify)
        var userDetails = {};
        userDetails.notification = response.response_data.total_unread_msg
         saveUserNotification(userDetails)
    

      })
      .catch(function (error) {
        
        console.log(JSON.stringify(error));
      });
  }
  
  const getUserCalories = (token) => {
    setLoading(true)
    Network('/get-user-calories', 'get', '', token)
      .then((response) => {
        if (response.response_code == 4000) {
          setLoading(false)
          props.navigation.navigate('Login');
        } else {
          console.log('usercaloris', JSON.stringify(response));
          setLoading(false)
          setUserCalories(response.response_data);
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
        setSessionKey('false');
        props.navigation.navigate('Login');
      });
  };

  const currentDate =
    new Date().getFullYear() +
    '-' +
    (new Date().getMonth() + 1) +
    '-' +
    new Date().getDate();

  const getUserStep = async() => {

    const token = await getToken();
    // setLoading(true)

    Network('/get-user-steps?date=' + currentDate, 'get', '', token)
      .then((response) => {
        setLoading(false)
        if (response.response_code == 2000) {
         

          console.log('userstep', JSON.stringify(response));
          setUserStep(response.response_data);
          // alert(response.response_data.Walking_data.total_steps);
          setStep(response.response_data.Walking_data.total_steps);
          // alert(step)
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
        setSessionKey('false');
        props.navigation.navigate('Login');
      });
  };

  const data = [
    {id: '1', topright: '1', name: '1'},  
    {id: '2', topright: '2', name: '2'},
    {id: '3', topright: '3', name: '3'},
    {id: '4', topright: '4', name: '4'},  
    {id: '5', topright: '5', name: '5'},
    {id: '6', topright: '6', name: '6'},


    // {id: '6', topright: '6', name: '6'},
  ];

  const percentage=userStep.Walking_data.total_steps*100
  return (
    <View
      style={{
        flex: 1,
        width:'90%',
        marginTop: 10,
        backgroundColor: COLORS.WHITE,
       alignSelf:'center',
        margin: 20,
        alignSelf:'center'
      }}>
{/* <Loader loading={loading}/> */}
<View style={{alignSelf:'center'}}>
               <ProgressCircle
               percent={percentage/1000}
               radius={65}
               borderWidth={12}
               color={COLORS.BLUE}
               shadowColor={COLORS.FAINTGRAY}
               bgColor="#fff"
           >
              <Text style={{ fontSize: 18 }}>  {step} step</Text>
           </ProgressCircle>
           </View>
      
    </View>
  );
}



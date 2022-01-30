import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {COLORS, HEIGHT, WIDTH, GAP, FONT} from '../../Utils/constants';
import Dialog from '../common/Dialog';
import {getToken, getUserId, setUserId,getUserType, setUserType} from '../../Utils/Preference';
import Network from '../../Services/Network';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { TimePickerModal } from 'react-native-paper-dates';

export default function AddExercise(props) {
  const data = [{id: '1', Button: '1'}];
  const [isActivitiesDialog, setIsActivitiesDialog] = useState(false);
  const [activityName, setActivityName] = useState({
    name: 'Type Exercise',
    calories: '0',
  });
  const [userId, setUserId] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [userType, setUserType] = useState('');
  const [exerciseList, setExerciseList] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isStartTime, setIsStartTime] = useState(true);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [visibleTime, setVisibleTime] = useState(false)
  const [visibleEndTime, setVisibleEndTime] = useState(false)

  useEffect(function () {
    token();
    lisener(); 
  }, []);

  const lisener = () => {
    props.navigation.addListener('focus', async () => {
      token();
    });
  };
 
  const token = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();
      const userType=await getUserType();
     
      setAuthToken(token);
      setUserId(id);
      getExerciseList(token);
      setUserType(userType)
    } catch (e) {}
  };

  const getExerciseList = (token) => {
    Network('/list-all-exercise', 'get', '', token)
      .then(function (response) {
        console.log('exerciselist', JSON.stringify(response));
        setExerciseList(response.response_data);
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };

  const addExcercise = async() => {
    const userType=await getUserType();
    const userID= userType==='user'?userId:props.userDetailsId

    if (activityName.name == 'Type Exercise') {
      Toast.show('Please Select excercise type');
    } else if (startTime == '00:00') {
      Toast.show('Please Select start time');
    } else if (endTime == '00:00') {
      Toast.show('Please Select end time');
    } else {
      let formData = new FormData();
      formData.append('exercise_id', activityName._id);
      formData.append('user_id', userID);
      formData.append('duration', diffTime(startTime, endTime));
      formData.append('calories_burned', '');

      Network('/add-exercise', 'post', formData, authToken)
        // .then(async (res) => {
        .then((res) => {
          console.log(JSON.stringify(res));
          Toast.show(res.response_message);
          setStartTime('00:00');
          setEndTime('00:00');
          setActivityName({
            name: 'Type Exercise',
            calories: '0',
          });
        })

        .catch((error) => {
          Toast.show(res.response_message);
        });
    }
  };

  const onChange = async(event, selectedDate) => {

    let currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    await setDate(currentDate);    
    // alert(date)


   let hour =selectedDate.getHours(); 
   let TimeType='';
 
    if(hour <= 11)
    {
 
      TimeType = 'AM';
 
    }
    else{
      TimeType = 'PM'; 
    }
 

    if( hour > 12 )
    {
      hour = hour - 12;
    }
    if( hour == 0 )
    {
        hour = 12;
    } 
 
 
    let minutes =selectedDate.getMinutes();
 
    if(minutes < 10)
    {
      minutes = '0' + minutes.toString();
    }
 
 
  
    let fullTime = hour.toString() + ':' + minutes.toString() +  ' ' + TimeType.toString();
    console.log('full',fullTime)
    // setStartTime(fullTime) 

    if (isStartTime) {
     
      // setStartTime(getTimeFromDateTime(currentDate));
   setStartTime(fullTime) 

    } else {
      // setEndTime(getTimeFromDateTime(currentDate));
     setEndTime(fullTime)
    }
    
  };

  const onDismissTime = React.useCallback(() => {
    setVisibleTime(false)
  }, [setVisibleTime])

  
  const onConfirmTime = React.useCallback(
    ({ hours, minutes }) => {
      setVisibleTime(false);
      
  
      let TimeType = '';

      if (hours <= 11) {
  
        TimeType = 'AM';
  
      }
      else {
        TimeType = 'PM';
      }
  
  
      if (hours > 12) {
        hours = hours - 12;
      }
      if (hours == 0) {
        hours = 12;
      }

      const s=  `${hours}:${minutes} ${TimeType}`
      setStartTime(s);
    },
    [setVisibleTime]
  );


  const onDismissEndTime = React.useCallback(() => {
    setVisibleEndTime(false)
  }, [setVisibleEndTime])
  
  const onConfirmEndTime = React.useCallback(
    ({ hours, minutes }) => {
      setVisibleEndTime(false);
      
  
      let TimeType = '';

      if (hours <= 11) {
  
        TimeType = 'AM';
  
      }
      else {
        TimeType = 'PM';
      }
  
  
      if (hours > 12) {
        hours = hours - 12;
      }
      if (hours == 0) {
        hours = 12;
      }

      const endtime=  `${hours}:${minutes} ${TimeType}`
      setEndTime(endtime)
    },
    [setVisibleEndTime]
  );


  const getTimeFromDateTime = (datetime) => {
    var date = new Date(datetime);
    date = date.getTime();
    var dateIST = new Date(date);
    dateIST.setHours(dateIST.getHours() + 5);
    dateIST.setMinutes(dateIST.getMinutes() + 30);
    console.log(dateIST);
    var minute = dateIST.getUTCMinutes();
    var hour = dateIST.getUTCHours();
    if (minute > 0) return hour + '.' + minute;
    else return hour + '.' + 0;
  };

  const convert24To12Hour = (timeString) => {
    var ts = timeString;
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    h = h < 10 ? '0' + h : h; // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? ' AM' : ' PM';
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  };

  const differenceBetweenTime = (startTime, endTime) => {
    var startTime = moment(startTime);
    var endTime = moment(endTime);
    var duration = moment.duration(endTime.diff(startTime));
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes()) % 60;
    // return hours + '.' + minutes;
    return minutes;
  };

  const diffTime=(startTime,endTime)=>{
    var startTime = moment(startTime, "HH:mm a");
    var endTime = moment(endTime, "HH:mm a");
    var duration = moment.duration(endTime.diff(startTime));

// duration in hours
var hours = parseInt(duration.asHours());

// duration in minutes
var minutes = parseInt(duration.asMinutes());

return Math.abs(minutes)+ ' ' +'Mins'
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = (timeType) => {
    setIsStartTime(timeType);
    showMode('time');
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {userType==='trainer' &&
       <View style={{ margin: 25, flexDirection: 'row' }}>
         <Image
          source={props.profile != null ?
            { uri: 'https://fit4yoursport.dk:1446/' + props.profile }
            : require('../../Assets/Auths/user.png')}
          style={{
            width: 60,
            height: 60,
            borderRadius: 100 / 2,
            overflow: 'hidden',
            borderWidth: 2,
            backgroundColor: COLORS.GRAY
          }}
        />
        <Text
          style={{
            color: COLORS.BLACK,
            fontSize: 18,
            paddingStart: 10,
            alignSelf: 'center',
            marginLeft:5
          }}>

          {props.fname} {props.lname}
        </Text>
        </View>
}
      <View
        style={{
          width: '90%',
          elevation: 4,
          borderRadius: 10,
          marginHorizontal: 20,
          padding: 10,
          marginTop: 20,
          backgroundColor: COLORS.WHITE,
          shadowColor: COLORS.GRAY,
          shadowOffset: {
            width: 0,
            height: 1
          },
          shadowOpacity: 0.6,
          shadowRadius: 1.32,
          marginHorizontal: 20,
          marginVertical: 10,
          marginTop: 20,
        }}>

          
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsActivitiesDialog(true)}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={activityName.name==='Type Exercise'?
            {color: COLORS.GRAY}:{color:COLORS.BLACK}}>
            {activityName.name}
            </Text>
            <Image
              source={require('../../Assets/Auths/down-arrow.png')}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </View>
        </TouchableOpacity>
        <Dialog
          isVisible={isActivitiesDialog}
          title="Exercise"
          onValueSelected={(value) => {
            setActivityName(value);
            setIsActivitiesDialog(false);
          }}
          onCancel={()=>setIsActivitiesDialog(false)}
          activityList={exerciseList}
        />
      </View>
      <View
        style={{
          width: '90%',
          elevation: 4,
          borderRadius: 6,
          marginHorizontal: 20,
          marginVertical: 10,
          backgroundColor: 'white',
          marginTop: 30,
          shadowColor: COLORS.GRAY,
          shadowOffset: {
            width: 0,
            height: 1
          },
          shadowOpacity: 0.6,
          shadowRadius: 1.32,
          marginHorizontal: 20,
          marginVertical: 10,
          marginTop: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#D8EEFF',
            paddingVertical: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: COLORS.BLACK,
              flex: 1,
              textAlign: 'center',
            }}>
            Start time
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: COLORS.BLACK,
              flex: 1,
              textAlign: 'center',
            }}>
            Stop time
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: COLORS.BLACK,
              flex: 1,
              textAlign: 'center',
            }}>
            Duration
          </Text>
          {/* <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: COLORS.BLACK,
              flex: 1,
              textAlign: 'center',
            }}>
            Calories
          </Text> */}
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              justifyContent:'space-around'
            }}>
              {/* <View>
             { startTime==='00:00'?
              <TouchableOpacity 
              style={{marginLeft:-10}}
              onPress={() => showTimepicker(true)}>
                <Text style={{padding:7,
                backgroundColor:COLORS.PRIMARY,
                  color:COLORS.WHITE,fontFamily:FONT.FAMILY.REGULAR,
                  borderRadius:10,fontSize:12}}>Start Time</Text>
              </TouchableOpacity>:
            <Text
              style={[{
                fontSize: 14,
                flex: 1,
                textAlign: 'center',
             color: COLORS.GRAY}]}
              onPress={() => showTimepicker(true)}>
              {startTime}
            </Text>}
            </View> */}
               <Text
               style={[{
                fontSize: 14,
            
                textAlign: 'center',
              },startTime==='00:00'?{color: COLORS.GRAY}:{color: COLORS.BLACK}]}
              onPress={() => setVisibleTime(true)}>
              {startTime}
            </Text>
            <Text
               style={[{
                fontSize: 14,
            
                textAlign: 'center',
              },endTime==='00:00'?{color: COLORS.GRAY}:{color: COLORS.BLACK}]}
              onPress={() => setVisibleEndTime(true)}>
              {endTime}
            </Text>
            {/* <Text
                style={[{
                  fontSize: 12,
                  flex: 1,
                  textAlign: 'center',
                },diffTime(startTime,endTime)==='0 Mins'?{color: COLORS.GRAY}:{color: COLORS.BLACK}]} */}
              {/* > */}
              {/* {differenceBetweenTime(startTime, endTime)} */}
             {/* { diffTime(startTime,endTime)} */}
            {/* </Text> */}

            {/* <View>
             { endTime==='00:00'?
              <TouchableOpacity 
              style={{marginLeft:-20}}
              onPress={() =>showTimepicker(false)}>
              <Text style={{padding:7,
                backgroundColor:COLORS.PRIMARY,
                  color:COLORS.WHITE,fontFamily:FONT.FAMILY.REGULAR,
                  borderRadius:10,fontSize:12}}>End Time</Text>
              </TouchableOpacity>:
            <Text
              style={[{
                fontSize: 14,
                flex: 1,
                textAlign: 'center',
             color: COLORS.GRAY}]}
              onPress={() => showTimepicker(false)}>
              {endTime}
            </Text>}
            </View> */}

            <View>
             
            <Text
              style={[{
                fontSize: 14,
                flex: 1,
                textAlign: 'center',
             },(startTime!=='00:00'&&endTime!=='00:00')?{color: COLORS.BLACK}:{color: COLORS.GRAY}]}
           >
            { (startTime!=='00:00'&&endTime!=='00:00')
             ? diffTime(startTime,endTime):'0 Min'}
            </Text>
            </View>
          
          </View>
          {/* {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={false}
              display="default"
              onChange={onChange}
            />
          )} */}


<TimePickerModal
        visible={visibleTime}
        onDismiss={onDismissTime}
        onConfirm={onConfirmTime}
        // hours={12} // default: current hours
        // minutes={14} // default: current minutes
        label="Select time" // optional, default 'Select time'
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale={'en'}
        style={{color:'red'}}
        />

<TimePickerModal
        visible={visibleEndTime}
        onDismiss={onDismissEndTime}
        onConfirm={onConfirmEndTime}
        // hours={12} // default: current hours
        // minutes={14} // default: current minutes
        label="Select time" // optional, default 'Select time'
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale={'en'}
        />
        </View>
      </View>
   
      <TouchableOpacity onPress={() => addExcercise()}>
        <View
          style={{
            width: '30%',
            padding: HEIGHT * 0.02,
            backgroundColor: COLORS.RED,
            borderRadius: 25,
            marginVertical: GAP.SMALL + 6,
            marginTop: 20,
            alignSelf: 'center',
            
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: FONT.SIZE.MEDIUM,
              color: COLORS.WHITE,
              fontFamily: FONT.FAMILY.REGULAR,
              fontWeight: 'bold',
            }}>
            Add
          </Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}

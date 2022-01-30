import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Alert,
  Picker,
} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS, HEIGHT, WIDTH, FONT } from '../../Utils/constants';
import Dialog from '../common/Dialog';
import { getToken, getUserId, setUserId, getUserType, getGoal, setGoal,setNotifyCount, getActionType } from '../../Utils/Preference';
import Network from '../../Services/Network';
import Toast from 'react-native-simple-toast';
import ProgressCircle from 'react-native-progress-circle';
import Loader from '../../Components/Common/Loader';
import { Calendar } from 'react-native-calendars';
import Moment from 'moment';
import Modal from 'react-native-modal';
import { saveUserNotification } from '../../redux/actions/saveNotifyAction'
import {connect} from 'react-redux';

function Goal(props) {
  const newDate =
    new Date().getFullYear() +
    '-' +
    (new Date().getMonth() + 1) +
    '-' +
    new Date().getDate();
  useEffect(function () {
    token();
    console.log('m..', monthDate)
  }, [monthDate]);


  const [isAddGoal, setIsAddGoal] = useState(false);
  const [isActivitiesDialog, setIsActivitiesDialog] = useState(false);
  const [activityName, setActivityName] = useState({ name: 'Select Activity' });
  const [isRepsDialog, setIsRepsDialog] = useState(false);
  const [isStatusDialog, setIsStatusDialog] = useState(false);

  const [RepsName, setRepsName] = useState('Reps');
  const [activityList, setActivityList] = useState([]);
  const [goalList, setgoalList] = useState([]);
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [measurement, setMeasurement] = useState('0');
  const [status, setStatus] = useState('Not Done');
  const [percentage, setPercentage] = useState(0);
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [markedDates, setMarkedDates] = useState([])
  const [monthDate, setMonthDate] = useState([]);
  const [currentDate, setCurrentDate] = useState(Moment());
  const [monthstring, setMonthString] = useState(Moment());
  const [Id, setId] = useState('');
const [show,setShow]=useState(false);
const [action,setAction]=useState('false')


  const token = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();
      const userType = await getUserType();
      const actionType = await getActionType();

      console.log('id...', id)
      setUserType(userType)
      setAuthToken(token);
      setUserId(id);
      getActivityList(token);
      getGoalList(currentDate);
      getGoalByMonth(token, id, monthstring);
      getNotification();
      setAction(actionType)

    } catch (e) { }
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
      //  await setNotifyCount(notify)
        var userDetails = {};
        userDetails.notification = response.response_data.total_unread_msg
         saveUserNotification(userDetails)
    

      })
      .catch(function (error) {
        
        console.log(JSON.stringify(error));
      });
  }


  const getActivityList = (token) => {
    Network('/list-activity', 'get', '', token)
      .then(function (response) {
        setActivityList(response.response_data);
        console.log('activityList', JSON.stringify(activityList));
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };

  const getGoalList = async (currentDate) => {

    const token = await getToken();
    const id = await getUserId();
    const userType = await getUserType();
    const userID = userType === 'user' ? id : props.userDetailsId
    const endUrl = '/list-goal?' + 'date=' + Moment(currentDate).format('YYYY-MM-DD') + '&user_id=' + userID;

    setLoading(true);
    Network(`/list-goal?date=${Moment(currentDate).format('YYYY-MM-DD')}&user_id=${userID}`, 'get', '', token)
      .then(async function (response) {
        setLoading(false);
        if (response.response_data.docs.length != 0) {

          const list = [];
          response.response_data.docs.map(item => {
            list.push({
              activity: item.activityName.activity,
              times: item.times,
              measurement :item.measurement,
              setStatus: false,
              is_completed:item.is_completed,
              _id:item._id
            })
          })

          await setgoalList(list);
          console.log('lll',goalList)
          updateGoalPercentage(response.response_data.docs);
          await setGoal(JSON.stringify(goalList));
          setInvalid(false)
          setMessage('')

          // console.log('goallist', JSON.stringify(response.response_data.docs));
        } else {
          setInvalid(true)
          setMessage('Goals not found.')
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };


  const getGoalByMonth = async (token, id, monthstring) => {


    const userType = await getUserType();
    const userID = userType === 'user' ? id : props.userDetailsId

    const endUrl = `/list-goal-by-month?user_id=${userID}&month=${Moment(monthstring).format('MM')}&year=${Moment(monthstring).format('YYYY')}`

    setLoading(true);
    Network(endUrl, 'get', '', token)
      .then(async function (response) {

        if (response.response_code === 2000) {
          // alert(JSON.stringify(response.response_data))

          let monthData = response.response_data;

          const monthNewData = monthData.reduce((monthNewData, newDate) => {

            console.log(monthNewData);
            console.log(newDate);

            if (!monthNewData[newDate.date]) {
              monthNewData[newDate.date] = [];
            }
            monthNewData[newDate.date].push(newDate);
            return monthNewData;
          }, {});

          // Edit: to add it in the array format instead
          const dateArrays = Object.keys(monthNewData).map((date) => {
            return {
              date,
              newDates: monthNewData[date]
            };
          });
          // alert(JSON.stringify(dateArrays))
          console.log('ggg', dateArrays)
          setMonthDate(dateArrays)

          let dates = dateArrays;
          let markedDates = {};


          for (let i = 0; i < dates.length; i++) {
            for (let j = 0; j < dates[i].newDates.length; j++) {

              const yesDate = dates[i].newDates.filter((item) => item.is_completed === 'yes')

              const percentageNo = (yesDate.length / dates[i].newDates.length) * 100;
              console.log('per', percentageNo)
              if (percentageNo === 100) {
                markedDates[dates[i].date] = { startingDay: true, color: '#FAFAD2', endingDay: true, textColor: 'red' }
              }
              if (percentageNo !== 100) {
                markedDates[dates[i].date] = { startingDay: true, color: COLORS.RED, endingDay: true, textColor: 'white' }
              }
            }


          }
          setMarkedDates(markedDates)
          setLoading(false);
          console.log('goalby month', JSON.stringify(response.response_data));
        } else {
          alert(JSON.stringify(response.response_message))
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
        alert(error)
        setLoading(false);
      });
  };


 const onCancel=(index)=>{
  let list = [...goalList];
  
  list[index].setStatus = false;
 setgoalList(list)
}

  const addGoal = async () => {
    const userType = await getUserType();
    const userID = userType === 'user' ? userId : props.userDetailsId;


    if (activityName.name == 'Select Activity') {
      Toast.show('please select activity');
    } else if (measurement == '0') {
      Toast.show('please enter number');
    } else {
      let formData = new FormData();
      formData.append('activity', activityName._id);
      formData.append('user_id', userID);
      formData.append('trainer_id', userId);
      formData.append('times', measurement);
      formData.append('measurement', RepsName);
      formData.append('date', Moment(currentDate).format('YYYY-MM-DD'));
      // formData.append('date', '2021-01-26');


      Network('/add-goal', 'post', formData, authToken)
        .then(function (response) {
          console.log('Add Goal', JSON.stringify(response));
          if (response.response_code == 2000) {
            setLoading(true)
            setIsAddGoal(false);
            getGoalList(currentDate);
            getGoalByMonth(authToken, userID, monthstring)
            setLoading(false)
            Alert.alert('', response.response_message);
          } else {
            Alert.alert('', response.response_message);
          }
        })
        .catch(function (error) {
          console.log(JSON.stringify(error));
          // alert(error)
        });
    }
  };

  const updateGoal = async (id, isCompleted) => {
    console.log('cccc', isCompleted)
    const userType = await getUserType();
    const token = await getToken();
    const userID = userType === 'user' ? userId : props.userDetailsId
    let formData = new FormData();
    formData.append('user_id', userID);
    formData.append('_id', id);
    formData.append('is_completed', isCompleted.name == 'Done' ? 'yes' : 'no');
    console.log('hh', formData)

    Network('/update-goal-status', 'post', formData, authToken)
      .then(function (response) {
        console.log('Add Goal', JSON.stringify(response));
        if (response.response_code == 2000) {

          getGoalByMonth(token, userID, monthstring);
          // alert(monthstring)
          getGoalList(currentDate);
          Toast.show(response.response_message)

        } else {
          Alert.alert('', response.response_message);
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };

  const updateGoalPercentage = (data) => {
    const count = data.length;
    const countValue = 100 / count;
    let percentage = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].is_completed == 'yes') {
        percentage = percentage + countValue;
      }
    }
    setPercentage(percentage);
    console.log('Percentage', percentage);
  };


  const getSelectedDayEvents = async (date) => {

    const token = await getToken();
    const id = await getUserId();
    const userType = await getUserType();
    const userID = userType === 'user' ? id : props.userDetailsId

    let dates = monthDate;
    let markedDates = {};

    if (dates.length != 0) {
      for (let i = 0; i < dates.length; i++) {
        console.log('hh', dates)
        for (let j = 0; j < dates[i].newDates.length; j++) {

          const yesDate = dates[i].newDates.filter((item) => item.is_completed === 'yes')

          const percentageNo = (yesDate.length / dates[i].newDates.length) * 100;
          console.log('per', percentageNo)
          if (percentageNo === 100) {
            markedDates[dates[i].date] = { startingDay: true, color: '#FAFAD2', endingDay: true, textColor: 'red' }
          }
          if (percentageNo !== 100) {
            markedDates[dates[i].date] = { startingDay: true, color: COLORS.RED, endingDay: true, textColor: 'white' }
          }
        }
      }
      markedDates[date] = { startingDay: true, color: '#D8EEFF', endingDay: true, textColor: COLORS.BLUE }
    } else {
      markedDates[date] = { startingDay: true, color: '#D8EEFF', endingDay: true, textColor: COLORS.BLUE }
    }

    setMarkedDates(markedDates);
    setCurrentDate(date);
    setLoading(true);
    Network(`/list-goal?date=${date}&user_id=${userID}`, 'get', '', token)
      .then(async function (response) {
        setLoading(false);
        if (response.response_data.docs.length != 0) {

          const list = [];
          response.response_data.docs.map(item => {
            list.push({
              activity: item.activityName.activity,
              times: item.times,
              measurement :item.measurement,
              setStatus: false,
              is_completed:item.is_completed,
              _id:item._id
            })
          })

          await setgoalList(list);
          updateGoalPercentage(response.response_data.docs);
          await setGoal(JSON.stringify(goalList));
          setInvalid(false)
          setMessage('')

          console.log('goallist', JSON.stringify(response.response_data.docs));
        } else {
          setInvalid(true)
          setMessage('Goals not found.')
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };



  const onMonthChange = async (month) => {
    const token = await getToken();
    const id = await getUserId();
    console.log('gg', month.dateString)
    getGoalByMonth(token, id, month.dateString)
    setMonthString(month.dateString)
  }


  const onPress = (index) => {
    let list = [...goalList];
  
    list[index].setStatus = true;
   setgoalList(list)

  }



  const returnRow = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 10,
          paddingHorizontal: 30,
        }}>
        <Text
          style={{
            fontSize: 12,
            color: COLORS.GRAY,
            flex: 1,
            textAlign: 'left',
            width: '33%'
          }}>
          {item.activity}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: COLORS.GRAY,
            marginStart: 10,
            flex: 1,
            textAlign: 'center',
            width: '33%'
          }}>
          {item.times} {item.measurement}
        </Text>
        {/* <View
                          style={{
                            color: COLORS.GRAY,
                            flex: 1,
                            backgroundColor: 'transparent',
                            marginTop: -20,
                          }}>
                          <Picker
                            mode=  "dropdown"
                            selectedValue={
                              item.is_completed == 'yes' ? 'Done' : 'Not Done'
                            }
                            onValueChange={(itemValue, itemPosition) => {
                              userType ==='user' &&  setStatus(itemValue);
                              userType ==='user' && updateGoal(item._id, itemValue);
                            }}
                            itemStyle={{fontSize: 10}}
                            style={{
                              width: 120,
                              alignItems: 'center',
                              
                            }}>
                              
                            <Picker.Item label="Not Done" value="Not Done" />
                            <Picker.Item label="Done" value="Done" />
                          </Picker>
                        </View> */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '33%',
            // backgroundColor:'red',
            justifyContent: 'space-evenly',

          }}>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => onPress(index)
            }>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 0,
                alignItems: 'center',
              }}>
              <Text style={{ color: COLORS.BLACK }}>{item.is_completed == 'yes' ? 'Done' : 'Not Done'}</Text>
              {(userType === 'user' && action!=='true')&&
                <Image
                  source={require('../../Assets/Auths/down-arrow.png')}
                  style={{
                    tintColor: COLORS.BLACK,
                    marginStart: 10,
                    height: 15,
                    width: 15,
                    alignSelf: 'center',
                  }}
                />}
            </View>
            <Dialog
          isVisible={(userType === 'user' && action!=='true') && goalList[index].setStatus===true}
          title="Status"
          onValueSelected={(value) => {
            console.log('id...', item._id)
            setStatus(value);
            updateGoal(item._id, value);
           
            goalList[index].setStatus=false

          }}
          type={3}
          activityList={statusList}
          onCancel={ ()=> onCancel(index)}
       />
          </TouchableOpacity>

       
        </View>
      </View>
      )
  }


  const currentYear = Moment().format('YYYY')
  const minDate = currentYear - 1 + '-01-01'
  const maxDate = currentYear + '-12-31'

  return (
    <View
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}
      style={{ flex: 1 }}>
      <Loader loading={loading} />
      {console.log('Data')}
      <View style={{ flex: 1, }}>
        {!isAddGoal && (
          <ScrollView style={{ flex: 1 }}>
            {userType === 'trainer' &&
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
                    marginLeft: 5
                  }}>

                  {props.fname} {props.lname}
                </Text>
              </View>}
            <View style={{ flex: 1, }}>
              {/* <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: COLORS.BLACK,
                  textAlign: 'center',
                }}>
                Today
              </Text>
             
              <View style={{alignSelf:'center',marginTop:20}}>
              <ProgressCircle
            percent={Math.floor(percentage)}
            radius={60}
            borderWidth={15}
            color={COLORS.BLUE}
            shadowColor={COLORS.FAINTGRAY}
            bgColor="#fff"
        >
            <Text style={{ fontSize: 18 }}>{Math.floor(percentage)} %</Text>
        </ProgressCircle>
        </View> */}

              <View>
                <Calendar
                  minDate={minDate}
                  maxDate={maxDate}
                  hideArrows={false}
                  enableSwipeMonths={true}
                  onMonthChange={(month) => onMonthChange(month)}
                  style={{ marginHorizontal: 20, borderWidth: 1, marginTop: 20, borderColor: COLORS.GRAY }}
                  theme={{
                    textDayHeaderFontSize: 16,
                    calendarBackground: "#ffffff",
                    todayTextColor: COLORS.RED,
                    dayTextColor: "#222222",
                    textDisabledColor: "#d9e1e8",
                    monthTextColor: COLORS.BLACK,
                    arrowColor: COLORS.RED,
                    textDayFontWeight: "300",
                    textMonthFontWeight: "bold",
                    textDayHeaderFontWeight: "500",
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    selectedDayBackgroundColor: '#222222',
                    selectedDayTextColor: "white",
                    // textDayHeaderFontSize: 8
                    // 'stylesheet.calendar.header': 
                    // {
                    header: {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginHorizontal: '40%',
                      alignItems: 'center',
                      backgroundColor: '#D8EEFF'
                    },
                    week: {
                      marginTop: -45,
                      backgroundColor: COLORS.BLACK,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      height: 50,
                      alignItems: 'center',
                    },
                    dayHeader: {
                      marginTop: 2,
                      marginBottom: 7,
                      // width: 34,
                      textAlign: 'center',
                      fontSize: 16,
                      fontWeight: '400',
                      color: COLORS.BLACK,

                    },
                    // },
                    'monthTextColor': COLORS.GRAY,
                    'textMonthFontSize': 18,
                  }}
                  // dayComponent={({ date, state }) =>
                  // 	this.renderDayComponent(date, state)
                  // }
                  markedDates={markedDates}
                  markingType={"period"}

                  onDayPress={day => {
                    getSelectedDayEvents(day.dateString);
                  }}

                />
              </View>
              <View style={{
                flexDirection: 'row', width: '90%', borderWidth: 0.5, borderTopWidth: 0,
                alignSelf: 'center', padding: 10, backgroundColor: 'white'
              }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
                  <View style={{ width: 15, height: 15, backgroundColor: '#FAFAD2' }}></View>
                  <Text style={{ marginLeft: 10 }}>Completed goal</Text>
                </View>
                <View>

                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%', }}>
                  <View style={{ width: 15, height: 15, backgroundColor: COLORS.RED }}></View>
                  <Text style={{ marginLeft: 10 }}>Not completed goal</Text>
                </View>
                <View>

                </View>
              </View>

              <Text style={{
                marginTop: 20, color: COLORS.BLACK,
                fontSize: FONT.SIZE.LARGE,
                fontFamily: FONT.FAMILY.SEMI_BOLD, textAlign: 'center'
              }}>{
                  Moment(currentDate).format('DD MMM YYYY')}
              </Text>

              <View
                style={{
                  width: '90%',
                  // height: 300,
                  elevation: 4,
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

                  backgroundColor: 'white',
                }}>


                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    paddingHorizontal: 30,
                    backgroundColor: '#D8EEFF',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: COLORS.BLACK,
                      textAlign: 'left',
                    }}>
                    Activities
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: COLORS.BLACK,
                      marginEnd: 20,
                      textAlign: 'center',
                    }}>
                    No.
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: COLORS.BLACK,
                       textAlign: 'left',
                    }}>
                    Status
                  </Text>
                </View>
                <View>
                  {!invalid ?
                   <FlatList
                      data={goalList}
                      renderItem={(item, index) => returnRow(item, index)}
                      keyExtractor={(item, index) => String(index)}
                    /> :
                    <Text style={{
                      textAlign: 'center',
                      color: COLORS.RED,
                      fontFamily: FONT.FAMILY.REGULAR,
                      margin: 10
                    }}>
                      {message}
                    </Text>}
                </View>
              </View>
              {userType === 'trainer' &&
                <View
                  style={{
                    margin: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity onPress={() => setIsAddGoal(true)}>
                    <Image
                      source={require('../../Assets/Auths/ADD.png')}
                      style={{
                        width: 50,
                        height: 50,
                        alignSelf: 'center',
                      }}
                    />
                  </TouchableOpacity>
                </View>}
            </View>
          </ScrollView>
        )}
        {isAddGoal && (
          <ScrollView>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  width: '90%',
                  elevation: 4,
                  borderRadius: 6,
                  marginHorizontal: 20,
                  marginVertical: 10,

                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: '#D8EEFF',
                    paddingVertical: 10,
                    paddingHorizontal: 30,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: COLORS.BLACK,
                    }}>
                    Activities
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: COLORS.BLACK,
                    }}>
                    No
                  </Text>
                </View>
                <View>
                  <FlatList
                    data={goalList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingVertical: 10,
                          paddingHorizontal: 30,
                        }}>
                        <Text style={{ fontSize: 12, color: COLORS.GRAY }}>
                          {item.activity}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: COLORS.GRAY,
                          }}>
                          {item.times} {item.measurement}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </View>

              <View
                style={{
                  width: '90%',
                  elevation: 4,
                  borderRadius: 6,
                  marginHorizontal: 20,
                  marginVertical: 10,
                  backgroundColor: 'white',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    paddingHorizontal: 30,
                    marginTop: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: COLORS.BLACK,
                    }}>
                    Activities
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: COLORS.BLACK,
                    }}>
                    No
                  </Text>
                </View>
                <View>
                  {/* <View
                    style={{
                       flexDirection: 'row',
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                    
                    }}>
                    <TouchableOpacity
                      
                      activeOpacity={1}
                      onPress={() => setIsActivitiesDialog(true)}
                      style={{
                        // flexDirection: 'row',
                        // borderColor: COLORS.GRAY,
                        // borderWidth: 1,
                        // paddingVertical: 6,
                        // flex: 1,
                        
                      //  justifyContent: 'space-between',
                        // alignItems: 'center',
                        //  width:'70%'
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                           paddingHorizontal:0,
                           width:'70%',
                        borderWidth:1,
                        paddingVertical: 10,
                        flex:1,
                        borderColor:COLORS.GRAY,
                        backgroundColor:'yellow'
                        }}>
                        <Text style={{ color: COLORS.BLACK, fontSize: 12 ,paddingHorizontal:10,alignSelf:'center',width:'80%'}}>
                          {activityName.name}
                        </Text>
                         
                         <View style={{}}>
                        <Image
                          source={require('../../Assets/Auths/down-arrow.png')}
                          style={{
                            tintColor: COLORS.BLACK,
                            // marginStart: 35,
                            marginRight:10,
                            height: 10,
                            width: 10,
                            alignSelf:'center',
                           
                          }}
                        />
                        </View>
                      
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        // justifyContent: 'space-between',
                        borderColor: COLORS.GRAY,
                        borderWidth: 1,
                        // marginLeft:5,
                        width:'40%'
                      }}>
                      <TextInput
                        style={{
                          color: COLORS.BLACK,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                        }}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={COLORS.GRAY}
                        onChangeText={(text) => setMeasurement(text)}
                      />
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setIsRepsDialog(true)}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            backgroundColor: COLORS.LIGHTGRAY,
                            paddingHorizontal: 8,
                            paddingVertical: 10,
                            alignItems: 'center',
                          }}>
                          <Text style={{ color: COLORS.BLACK }}>{RepsName}</Text>
                          <Image
                            source={require('../../Assets/Auths/down-arrow.png')}
                            style={{
                              tintColor: COLORS.BLACK,
                              marginStart: 6,
                              height: 10,
                              width: 10,
                              alignSelf: 'center',
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View> */}

                  <View style={{flexDirection:'row', justifyContent:'space-between',width:'90%',alignSelf:'center'}}>
                      <View style={{width:'60%'}}>
                      <TouchableOpacity
                      
                      activeOpacity={1}
                      onPress={() => setIsActivitiesDialog(true)}
                      style={{
                        // flexDirection: 'row',
                        // borderColor: COLORS.GRAY,
                        // borderWidth: 1,
                        // paddingVertical: 6,
                        // flex: 1,
                        
                      //  justifyContent: 'space-between',
                        // alignItems: 'center',
                        //  width:'70%'
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                           paddingHorizontal:0,
                          //  width:'70%',
                        borderWidth:1,
                        paddingVertical: 10,
                        flex:1,
                        borderColor:COLORS.GRAY,
                        }}>
                        <Text style={{ color: COLORS.BLACK, fontSize: 12 ,paddingHorizontal:10,alignSelf:'center',width:'80%'}}>
                          {activityName.name}
                        </Text>
                         
                         <View style={{}}>
                        <Image
                          source={require('../../Assets/Auths/down-arrow.png')}
                          style={{
                            tintColor: COLORS.BLACK,
                            // marginStart: 35,
                            marginRight:10,
                            height: 10,
                            width: 10,
                            alignSelf:'center',
                           
                          }}
                        />
                        </View>
                      
                      </View>
                    </TouchableOpacity>
                      </View>
                      <View style={{width:'35%',flexDirection:'row',justifyContent:'space-between',borderWidth:1,borderColor:COLORS.GRAY}}>
                      {/* <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                         justifyContent: 'space-between',
                        borderColor: COLORS.GRAY,
                        borderWidth: 1,
                        // marginLeft:5,
                        width:'40%'
                      }}> */}
                      <TextInput
                        style={{
                          color: COLORS.BLACK,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                        //  flex:1
                        }}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={COLORS.GRAY}
                        onChangeText={(text) => setMeasurement(text)}
                      />
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setIsRepsDialog(true)}
                        style={{backgroundColor:COLORS.LIGHTGRAY,flex:1,justifyContent:'center'}}
                        >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            backgroundColor: COLORS.LIGHTGRAY,
                             paddingHorizontal: 8,
                             paddingVertical: 10,
                        
                          }}
                          >
                          <Text style={{ color: COLORS.BLACK }}>{RepsName}</Text>
                          <Image
                            source={require('../../Assets/Auths/down-arrow.png')}
                            style={{
                              tintColor: COLORS.BLACK,
                              marginStart: 6,
                              height: 10,
                              width: 10,
                              alignSelf: 'center',
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                    {/* </View> */}
                      </View>
                  </View>

                  <View
                    style={{
                      alignItems: 'center',
                      marginVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setIsAddGoal(false)}>
                      <Text
                        style={{
                          alignItems: 'center',
                          paddingVertical: 6,
                          paddingHorizontal: 25,
                          borderRadius: 10,
                          color: 'white',
                          backgroundColor: 'red',
                          marginEnd: 10,
                        }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={addGoal}>
                      <Text
                        style={{
                          alignItems: 'center',
                          paddingVertical: 6,
                          paddingHorizontal: 25,
                          borderRadius: 10,
                          color: 'white',
                          backgroundColor: 'red',
                          marginStart: 10,
                        }}>
                        +Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <Dialog
                isVisible={isActivitiesDialog}
                title="Goals"
                onValueSelected={(value) => {
                  setActivityName(value);
                  setIsActivitiesDialog(value);
                }}
                type={1}
                activityList={activityList}
                onCancel={() => setIsActivitiesDialog(false)}


              />
              <Dialog
                isVisible={isRepsDialog}
                title="Reps"
                onValueSelected={(value) => {
                  setRepsName(value.name);
                  setIsRepsDialog(value);
                }}
                type={2}
                activityList={repsData}
                onCancel={() => setIsRepsDialog(false)}


              />

            </View>



          </ScrollView>
        )}
      </View>


    </View>
  );
}

const repsData = [{ name: 'Reps' }, { name: 'Sets' }, { name: 'Km' }];
const statusList = [{ name: 'Not Done' }, { name: 'Done' }];


export default connect(null,{saveUserNotification})(Goal);
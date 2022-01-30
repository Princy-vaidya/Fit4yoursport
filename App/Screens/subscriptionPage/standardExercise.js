import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, HEIGHT, WIDTH, GAP, FONT } from '../../Utils/constants';
import { getToken, getUserId, setUserId } from '../../Utils/Preference';
import YouTube from 'react-native-youtube';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Modal from 'react-native-modal';
import Network from '../../Services/Network';
import Toast from 'react-native-simple-toast';
import Moment from 'moment';
import Loader from '../../Components/Common/Loader';
import { setDisplayName } from 'recompose';
import Header from '../../Utils/Header'
import {useFocusEffect} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function standardExercise(props,route) {
  const [exerciseList, setExerciseList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [subCategoryDetail, setSubCategoryDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isStartTime, setIsStartTime] = useState(true);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [timer, setTimer] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const countRef = useRef(null);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [restingTime, setRestingTime] = useState('');
  const [kilo, setKilo] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [message, setMessage] = useState('');
  const [loading,setLoading]=useState(false)
  const [edit,setEdit]=useState(false);
  const [listId,setListId]=useState('')



  // useEffect(function () {
  //   token();

  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      token();

     
    }, []),
  );

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  const handlePause = () => {
    clearInterval(countRef.current)
    setIsPaused(false)
  }

  const handleResume = () => {
    setIsPaused(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  const handleReset = () => {
    clearInterval(countRef.current)
    setIsActive(false)
    setIsPaused(false)
    setTimer(0)
  }


  const formatTime = (timer) => {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

    return `${getHours} : ${getMinutes} : ${getSeconds}`
  }
  const token = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();

      // getExerciseList(token);
      // setAuthToken(token);
      // setUserId(id);
      // getWorkoutList(Id)
      // getData(token)
      getCategoryList(token)
      // alert(JSON.stringify(subCategoryDetail._id))
    
    } catch (e) { }
  };

  const getExerciseList = (token) => {
    Network('/list-workout-category?page=1&limit=100', 'get', '', token)
      .then(function (response) {
        console.log('exerciselist', JSON.stringify(response));
        setExerciseList(response.response_data.docs);
        // alert(JSON.stringify(exerciseList))
        s;
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };

  

  const getCategoryList = (token) => {
    console.log('id....',props.route.params.packageId)
    setLoading(true)
  
    Network(
      `/list-standard-workout?page=1&limit=100&program_category_id=${props.route.params.packageId}`,
      'get',
      '',
      token,
    )
      .then(function (response) {
       

        console.log('categorylist', JSON.stringify(response));
        setSubCategoryList(response.response_data.docs);
      
        // alert(response.response_data.docs)
        setPageNo(2);
        // s;
        setLoading(false)
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let hour = selectedDate.getHours();
    let TimeType='';

    if (hour <= 11) {

      TimeType = 'AM';

    }
    else {
      TimeType = 'PM';
    }


    if (hour > 12) {
      hour = hour - 12;
    }
    if (hour == 0) {
      hour = 12;
    }


    let minutes = selectedDate.getMinutes();
   

    if (minutes < 10) {
      minutes = '0' + minutes.toString();
    }



   let fullTime = hour.toString() + ':' + minutes.toString() + ' ' + TimeType.toString();


    if (isStartTime) {
      // setStartTime(getTimeFromDateTime(currentDate));
      setStartTime(fullTime)
    } else {
      // setEndTime(getTimeFromDateTime(currentDate));
      setEndTime(fullTime)
    }

  };


  const onUpdateWorkout=async(listId)=>{
    
      const id = await getUserId();
      const token = await getToken();
     
  
      let data = new FormData();
      data.append('start_time', startTime);
      data.append('end_time', endTime);
      data.append('sets', sets);
      data.append('weight', weight);
      data.append('resting_time', restingTime);
      data.append('duration', diffTime(startTime,endTime));
      data.append('workout_id',subCategoryDetail._id);
      data.append('user_id', id);
      data.append('kilo', kilo);
      data.append('repeat',reps);
      data.append('_id',listId)
  
      console.log('formd',data)
      Network('/update-user-workout', 'POST', data, token)
        .then((res) => {
          console.log('uploadimage Successful==>' + JSON.stringify(res));
          if (res.response_code == 2000) {
           
            Toast.show(res.response_message);
            getWorkoutListUpdate(id,token)
            
          } else {
            Toast.show(res.response_message);
           
          }
        })
        .catch((err) => {
          console.log('Error --' + JSON.stringify(err));
        });
       
     setShowModal(false);
     setEdit(false);
     setSets('')
     setKilo('')
     setReps('')
     setWeight('')
     setRestingTime('')
     setStartTime('00:00')
     setEndTime('00:00')
  }


  const onAddWorkout=async()=>{
    const id = await getUserId();
    const token = await getToken();
    
if(startTime==''|| endTime=='' || sets==''|| weight==''||restingTime==''||reps==''){
  Toast.show('Please fill all Details.');
}else{
 

    let data = new FormData();
    data.append('start_time', startTime);
    data.append('end_time', endTime);
    data.append('sets', sets);
    data.append('weight', weight);
    data.append('resting_time', restingTime);
    data.append('duration', diffTime(startTime,endTime));
    data.append('workout_id',subCategoryDetail._id);
    data.append('user_id', id);
    data.append('kilo', kilo);
    data.append('repeat',reps);

    console.log('formd',data)
    Network('/add-user-workout-log', 'POST', data, token)
      .then((res) => {
        console.log('uploadimage Successful==>' + JSON.stringify(res));
        if (res.response_code == 2000) {
         
          Toast.show(res.response_message);
          getWorkoutListUpdate(id,token)
          
        } else {
          Toast.show(res.response_message);
         
        }
      })
      .catch((err) => {
        console.log('Error --' + JSON.stringify(err));
      });
      setShowModal(false)
      setSets('');
      setWeight('');
      setReps('');
      setKilo('');
      setStartTime('00:00');
      setEndTime('00:00');
      diffTime(startTime,endTime)
  }
   
  }

 const onDelete=async(ID)=>{
 const token = await getToken();
 const id = await getUserId(); 
  let data = new FormData();
  data.append('_id', ID);
  setLoading(true)
  Network('/delete-user-workout','POST', data, token)
    .then((res) => {
      setLoading(false);
      if (res.response_code === 2000) {
        Toast.show(res.response_message);
        getWorkoutListUpdate(id,token);
    }else{
      Toast.show(res.response_message);
    }
    })

    .catch((error) => {
      setLoading(false);
      Toast.show(res.response_message);
    })

  }
  const getWorkoutList=async(Id)=>{
    const token= await getToken();
    const id =await getUserId();
    console.log('deails')
    setInvalid(false)
     setLoading(true);

   
    Network(`/list-user-workout?workout_id=${Id}&user_id=${id}&date=${Moment(date).format('YYYY-MM-DD')}`, 'get', '', token)
      .then(function (response) {
      
    
        setLoading(false);
        if(response.response_data.docs.length!=0){
          setMessage('');
          setInvalid(false)
       setData(response.response_data.docs)
       
         
        }else{
          setInvalid(true)
          setMessage('Workout details not found.')
          
        }
      })
      .catch(function (error) {
        console.log('ggg',JSON.stringify(error));
        // alert(JSON.stringify(error))
      });
  }


  const getWorkoutListUpdate=async(id,token)=>{
    
    setInvalid(false)
     setLoading(true);

   
    Network(`/list-user-workout?workout_id=${subCategoryDetail._id}&user_id=${id}&date=${Moment(date).format('YYYY-MM-DD')}`, 'get', '', token)
      .then(function (response) {
      
    
        setLoading(false);
        if(response.response_data.docs.length!=0){
          setMessage('');
          setInvalid(false)
         setData(response.response_data.docs)
        
         
        }else{
          setInvalid(true)
          setMessage('Workout details not found.')
          
        }
      })
      .catch(function (error) {
        console.log('ggg',JSON.stringify(error));
        alert(JSON.stringify(error))
      });
  }

  const returnData = (item, index) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          paddingVertical: 10,
          justifyContent: "space-evenly",
          marginHorizontal: 5
        }}>
        <Text
          style={{
            fontSize: 14,
            color: COLORS.GRAY,
            // flex: 0.10,
            width:'10%',
            textAlign:'center',
            // marginHorizontal: -3,
            fontSize: FONT.SIZE.SMALL
          }}>
          {item.sets}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: COLORS.GRAY,
            // flex: 0.10,
            width:'10%',
            textAlign:'center',
            // marginHorizontal: 10,
            fontSize: FONT.SIZE.SMALL

          }}>
          {item.repeat}
        </Text>

        {/* <Text
          style={{
            fontSize: 14,
            color: COLORS.GRAY,
            // flex: 0.10,
            width:'10%',
            textAlign:'center',
            // textAlign: "left",
            // marginHorizontal: 10,
            fontSize: FONT.SIZE.SMALL

          }}>
          {item.kilo}
        </Text> */}
        <Text
          style={{
            fontSize: 14,
            color: COLORS.GRAY,
            width:'11%',
            textAlign:'center',
        

            fontSize: FONT.SIZE.SMALL

          }}>
          {item.weight}kg
        </Text>



        <Text
          style={{
            fontSize: 14,
            color: COLORS.GRAY,
            textAlign:'center',
            // flex: 0.15,
            // marginRight:10,
            width:'15%',
            fontSize: FONT.SIZE.SMALL

          }}>
          {item.resting_time}min
      </Text>

        <Text
          style={{
            fontSize: 12,
            color: COLORS.GRAY,
            //  flex: 0.1,
            width:'15%',
            textAlign:'center',
            marginLeft: 0,
            // textAlign: "right",
            fontSize: FONT.SIZE.SMALL
          }}>
          {/* {differenceBetweenTime(
          getTimeFromDateTime(subCategoryDetail.start_time),
          getTimeFromDateTime(subCategoryDetail.end_time),
        )} */}
          {diffTime(item.start_time,item.end_time)}
      </Text>

      

        <TouchableOpacity onPress={() => onEditWorkOut(item)}
          style={{ backgroundColor: COLORS.RED, borderRadius: 10 }}>
          <Text style={{ color: COLORS.WHITE, padding: 7, paddingTop: 4, paddingBottom: 4 }}>Edit</Text>
        </TouchableOpacity>

          <TouchableOpacity onPress={() => onDelete(item._id)}
          style={{ backgroundColor: COLORS.RED, borderRadius: 10 }}>
          <Text style={{ color: COLORS.WHITE, padding: 7, paddingTop: 4, paddingBottom: 4 }}>Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }


  const onEditWorkOut = (item) => {
    setEdit(true);
    setShowModal(true);
    setSets(item.sets)
    setKilo(item.kilo)
    setReps(item.repeat)
    setWeight(item.weight)
    setRestingTime(item.resting_time)
    setStartTime(item.start_time);
    setEndTime(item.end_time)
    setListId(item._id);
    console.log('id',data)
  }

  const onBackPress = (index) => {
    let workoutList = [...data];
    console.log('w',workoutList )
    workoutList[index].setListEdit = false;
    setData(workoutList)
    console.log('id',data)
  }

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

  const diffTime = (startTime, endTime) => {
    var startTime = moment(startTime, "HH:mm a");
    var endTime = moment(endTime, "HH:mm a");
    var duration = moment.duration(endTime.diff(startTime));

    // duration in hours
    var hours = parseInt(duration.asHours());

    // duration in minutes
    var minutes = parseInt(duration.asMinutes());

    return Math.abs(minutes) + '' + 'min'
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


  const onBckdrop =()=>{
    setShowModal(false)
    setEdit(false);
    setSets('')
    setReps('')
    setWeight('')
    setRestingTime('')
    setStartTime('00:00');
    setEndTime('00:00')
 
  }

  return (
      <SafeAreaView style={{flex:1,
        backgroundColor: COLORS.WHITE,
  }}>
           
          <Loader loading={loading} />
    {/* <ScrollView
      style={{
         backgroundColor: COLORS.WHITE,
      }}> */}
        
      <>
        {/* {
          pageNo != 1 && (

            <TouchableOpacity onPress={() => {setPageNo(1)}} style={{ marginHorizontal: 20 }}>
              <Image
                source={require('../../Assets/Auths/back.png')}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: 'contain',
                  tintColor: COLORS.RED,
                }}
              />
            </TouchableOpacity>
          )
        }
        {pageNo == 1 && (
          <FlatList
            data={exerciseList}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  getCategoryList(item._id);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderWidth: 0.2,
                    borderRadius: 4,
                    padding: 14,
                    margin: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: COLORS.BLACK,
                    }}>
                    {item.categoryName}
                  </Text>
                  <Image
                    source={require('../../Assets/Auths/arrow.png')}
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: 'contain',
                      tintColor: COLORS.RED,
                    }}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        )} */}

        {/* subcategory */}
        {pageNo == 2 && (

  
          <View style={{
         backgroundColor: COLORS.WHITE,
      }}>
<Header
          navigation={props.navigation}
          title="Standard Exercise"
          type='back'
        />
<ScrollView
      style={{
         backgroundColor: COLORS.WHITE,
      }}>

            <FlatList
              data={subCategoryList}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSubCategoryDetail(item);
                    setLoading(false)
                    setPageNo(3);
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderWidth: 0.1,
                      padding: 5,
                       backgroundColor: 'white',
                      margin: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: COLORS.WHITE,
                      alignItems: 'center',
                      shadowColor: COLORS.GRAY,
                      elevation:1,
                      shadowOffset: {
                        width: 0,
                        height: 1
                      },
                      shadowOpacity: 0.6,
                      shadowRadius: 1.32,
                    }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: COLORS.WHITE,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={(item.icon===null||item.icon=='')?require('../../Assets/Auths/Vector.png'):{uri:item.icon}}
                        style={{
                          width: 25,
                          height: 25,
                          resizeMode: 'contain',
                          tintColor: COLORS.BLACK,
                          // borderRadius:30,
                          // backgroundColor:COLORS.BLUE
                        }}
                      />
                    </View>

                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        flex: 1,
                        marginStart: 30,
                        color: COLORS.BLACK,
                      }}>
                      {item.name}
                    </Text>
                    <Image
                      source={require('../../Assets/Auths/down-arrow.png')}
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                        tintColor: COLORS.BLACK,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
            </ScrollView>
          </View>
        )}

        {/* subcategory */}
        {pageNo == 3 && (
          <View >
<TouchableOpacity onPress={()=>setPageNo(2)}
style={{ backgroundColor:COLORS.WHITE}}>
<Image
                source={require('../../Assets/Auths/back.png')}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: 'contain',
                  tintColor: COLORS.RED,
                  margin:20,
                 
                }}
              />
</TouchableOpacity>

<ScrollView
      style={{
         backgroundColor: COLORS.WHITE,
      }}>
            <View style={{ margin: 20,marginTop:0 }}>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 0.1,
                  padding: 10,
                  backgroundColor: '#D8EEFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: COLORS.WHITE,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={{ uri: subCategoryDetail.icon }}
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: 'contain',
                      tintColor: COLORS.BLACK,
                    }}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    flex: 1,
                    marginStart: 30,
                    color: COLORS.BLACK,
                  }}>
                  {subCategoryDetail.name}
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 4,
                  }}
                  onPress={() => {
                    setPageNo(2);
                    setLoading(false)
                  }}>
                  <Image
                    source={require('../../Assets/Auths/down-arrow.png')}
                    style={{
                      width: 15,
                      height: 15,
                      resizeMode: 'contain',
                      tintColor: COLORS.BLACK,
                      padding: 4,
                    }}
                  />
                </TouchableOpacity>
              </View>
              {/* <YouTube
              apiKey="AIzaSyCEqzzRcF2mkNl5fh3rflqgn7YyPctnI14"
              // videoId={subCategoryDetail.video_url.split('youtu.be/')[1]}
              videoId="pEO2a7QzXqQ"
              play
              loop
              style={{
                alignSelf: 'stretch',
                width: windowWidth / 1.1,
                height: windowHeight / 2.5,
              }}
            /> */}

              <View style={{ width: windowWidth / 1.12, height: windowHeight / 2.5, }}>
                <WebView
                  allowsInlineMediaPlayback
                  mediaPlaybackRequiresUserAction
                  source={{ uri: 'https://www.youtube.com/embed/' + subCategoryDetail.video_url.split('=')[1] }}
                />
              </View>

              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.GRAY,
                  marginTop: 10,
                }}>
                {subCategoryDetail.description}
              </Text>

              
            </View>
            </ScrollView>
            {/* <View
            style={{
              width: '80%',
              padding: HEIGHT * 0.02,
              backgroundColor: COLORS.RED,
              borderRadius: 25,
              marginVertical: GAP.SMALL + 6,
              marginTop: 10,
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
              Ok
            </Text>
          </View> */}

            {/* <Text>{formatTime(timer)}</Text>
          { !isActive && !isPaused ?
          <TouchableOpacity onPress={()=>handleStart()}>
            <Text>start</Text>
          </TouchableOpacity>:
          <TouchableOpacity  onPress={()=>handlePause()}>
            <Text>stop</Text>
          </TouchableOpacity>} */}
            <View style={{  borderColor: COLORS.GRAY }}>
              <ScrollView horizontal={true} alignSelf='center' >
                <View
                  style={{
                    // width: '100%',
                    elevation: 4,
                    borderRadius: 6,
                    marginHorizontal: 15,
                    marginVertical: 10,
                    backgroundColor: 'white',
                    marginTop: 10,
                    marginBottom: 30,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#D8EEFF',
                      paddingVertical: 10,
                      width: '100%',
                      justifyContent: 'space-around'
                    }}>
                    {/* <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: COLORS.BLACK,
                        // flex: 1,
                        width:'10%',
                        textAlign:'center',
                        marginHorizontal: 10,
                        fontSize: FONT.SIZE.SMALL
                      }}>
                      Sets
              </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: COLORS.BLACK,
                        // flex: 1,
                        width:'10%',
                        textAlign:'center',
                        marginHorizontal: 10,
                        fontSize: FONT.SIZE.SMALL
                      }}>
                      Reps
              </Text> */}
              {/* <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: COLORS.BLACK,
                        // flex: 1,
                        width:'10%',
                        textAlign:'center',
                        marginHorizontal: 10,
                        fontSize: FONT.SIZE.SMALL
                      }}>
                      Kilo
              </Text> */}
                    {/* <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: COLORS.BLACK,
                        // flex: 1,
                        width:'11%',
                        textAlign:'center',
                        marginHorizontal: 10,
                        fontSize: FONT.SIZE.SMALL
                      }}>
                      Weight
              </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: COLORS.BLACK,
                        flex: 1,
                        width:'15%',
                         textAlign:'center',
                        marginHorizontal: 10,
                        fontSize: FONT.SIZE.SMALL
                      }}>
                      Rest time
              </Text> */}
                    {/* <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: COLORS.BLACK,
                      // flex: 1,
                      textAlign: 'center',
                      marginHorizontal: 10,
                      fontSize:FONT.SIZE.SMALL
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
                      marginHorizontal: 4,
                      fontSize:FONT.SIZE.SMALL
                    }}>
                    Stop time
              </Text> */}
                    {/* <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: COLORS.BLACK,
                        // flex: 1,
                        width:'15%',
                         textAlign:'center',
                        marginHorizontal: 10,
                        fontSize: FONT.SIZE.SMALL
                      }}>
                      Duration
              </Text> */}
                    {/* <View
                      style={{
                        // fontSize: 16,
                        // fontWeight: 'bold',
                        color: COLORS.BLACK,
                        width: 100,
                        textAlign: 'center',
                        marginHorizontal: 10,
                        // fontSize:FONT.SIZE.SMALL
                      }}>

                    </View> */}
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
                    {/* <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      paddingVertical: 10,
                      justifyContent: "space-evenly",
                      marginHorizontal: 5
                    }}> */}
                    {/* <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.GRAY,
                        // flex: 0.10,
                        // marginHorizontal:4,
                        fontSize:FONT.SIZE.SMALL
                      }}>
                      {subCategoryDetail.sets}
                    </Text> */}
                    {/* <View style={[styles.textInputContainer, styles.typeView]}> */}
                    {/* <TextInput
              style={{padding:-10}}
              // placeholder='Type here ...'
              placeholderTextColor="grey"
              autoCorrect={false}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              blurOnSubmit={true}
              multiline={true}
              // numberOfLines={5}
              value={sets}
              onChangeText={input => {
                setSets(input)
              }}
              keyboardType="default"
              mode="outlined"

            /> */}
                    {/* </View> */}
                    {/* <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.GRAY,
                        // flex: 0.10,
                        textAlign: "left",
                        marginHorizontal:10,
                        fontSize:FONT.SIZE.SMALL

                      }}>
                      {subCategoryDetail.reps}
                    </Text>

                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.GRAY,
                        // flex: 0.13,
                        marginHorizontal:13,
                        textAlign: "left",
                        fontSize:FONT.SIZE.SMALL

                      }}>
                      {subCategoryDetail.weight}
                    </Text> */}

                    {/* <TextInput
              style={{padding:-10}}
              // placeholder='Type here ...'
              placeholderTextColor="grey"
              autoCorrect={false}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              blurOnSubmit={true}
              multiline={true}
              // numberOfLines={5}
              value={sets}
              onChangeText={input => {
                setSets(input)
              }}
              keyboardType="default"
              mode="outlined"

            /> */}
                    {/* <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.GRAY,
                        flex: 0.15,
                        fontSize:FONT.SIZE.SMALL

                      }}>
                      {subCategoryDetail.resting_time}
                    </Text> */}

                    {/* 
                    { startTime==='00:00'?
              <TouchableOpacity 
              style={{marginHorizontal:-15}}
              onPress={() =>showTimepicker(true)}>
              <Text style={{ padding:7,
                backgroundColor:COLORS.PRIMARY,
                  color:COLORS.WHITE,fontFamily:FONT.FAMILY.REGULAR,
                  borderRadius:10,fontSize:10}}>Start Time</Text>
              </TouchableOpacity>:
            <Text
              style={[{
                fontSize: 12,
                color: COLORS.GRAY,
                 marginLeft:-15,
                textAlign: "center",
                fontSize:FONT.SIZE.SMALL}]}
              onPress={() => showTimepicker(true)}>
              {startTime}
            </Text>} */}


                    {/* { endTime==='00:00'?
              <TouchableOpacity 
              style={{marginRight:-10}}
              onPress={() =>showTimepicker(false)}>
              <Text style={{ padding:7,
                backgroundColor:COLORS.PRIMARY,
                  color:COLORS.WHITE,fontFamily:FONT.FAMILY.REGULAR,
                  borderRadius:10,fontSize:10}}>End Time</Text>
              </TouchableOpacity>:
            <Text
              style={[{
                fontSize: 12,
                color: COLORS.GRAY,
              marginLeft:0,
                textAlign: "center",
                fontSize:FONT.SIZE.SMALL}]}
              onPress={() => showTimepicker(false)}>
              {endTime}
            </Text>} */}
                    {/* <Text
                      style={{
                        fontSize: 12,
                        color: COLORS.GRAY,
                        // flex: 0.10,
                        textAlign: "right",
                        fontSize:FONT.SIZE.SMALL
                      }}> */}
                    {/* {differenceBetweenTime(
                        getTimeFromDateTime(subCategoryDetail.start_time),
                        getTimeFromDateTime(subCategoryDetail.end_time),
                      )} */}
                    {/* { (startTime!=='00:00'&&endTime!=='00:00')
             ? diffTime(startTime,endTime):'0 Min'} */}
                    {/* </Text> */}
                    {/* <Text
              style={{
                fontSize: 12,
                color: COLORS.GRAY,
                flex: 1,
                textAlign: 'center',
              }}>
              {activityName.calories *
                differenceBetweenTime(startTime, endTime)}
            </Text> */}
                    {/* </View> */}
                  
                    {/* {!invalid ?
                      <FlatList
                      data={data}
                      keyExtractor={(item, index) => index.toString()}

                      renderItem={({ item, index }) => returnData(item, index)} />
                      :<Text style={{textAlign:'center',color:COLORS.RED,margin:10}}>{message}</Text>} */}
                    
                  
                  </View>
                </View>


              </ScrollView>
              {/* <TouchableOpacity onPress={() => { setShowModal(true) }}>
                <Image
                  source={require('../../Assets/Auths/ADD.png')}
                  style={{
                    width: 50,
                    height: 50,
                    alignSelf: 'center',
                    marginBottom:20
                  }}
                />
              </TouchableOpacity> */}
            </View>

            <Modal transparent={true}
              visible={showModal}
              onBackdropPress={() => onBckdrop()}
              style={{
                flex: 1,
                justifyContent: 'center',
                width: '100%',
                alignSelf: 'center',
                margin: -10,
                backgroundColor: '#000000aa',
              }}>
              <View style={styles.modalView}>
                <View style={{ margin: 10 }}>
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ width: '50%', justifyContent: 'center' }}>
                      <Text style={styles.itemName}>Sets:-</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                      <TextInput
                        style={styles.TextInputText}
                        placeholder='0'
                        autoCorrect={false}
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                        blurOnSubmit={true}
                        multiline={false}
                        maxLength={5}
                        keyboardType="phone-pad"
                        mode="outlined"
                        value={sets}
                        onChangeText={(value) =>
                          // onTipEdit(value, index)
                          setSets(value)
                        }

                      />

                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ width: '50%', justifyContent: 'center' }}>
                      <Text style={styles.itemName}>Reps:-</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                      <TextInput
                        style={styles.TextInputText}
                        placeholder='0'
                        autoCorrect={false}
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                        blurOnSubmit={true}
                        multiline={false}
                        maxLength={5}
                        keyboardType="phone-pad"
                        mode="outlined"
                        value={reps}
                        onChangeText={(value) =>
                          // onTipEdit(value, index)
                          setReps(value)
                        }

                      />

                    </View>
                  </View>

                  {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ width: '50%', justifyContent: 'center' }}>
                      <Text style={styles.itemName}>Kilo:-</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                      <TextInput
                        style={styles.TextInputText}
                        placeholder='0'
                        autoCorrect={false}
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                        blurOnSubmit={true}
                        multiline={false}
                        maxLength={5}
                        keyboardType="phone-pad"
                        mode="outlined"
                        value={kilo}
                        onChangeText={(value) =>
                          // onTipEdit(value, index)
                          setKilo(value)
                        }

                      />

                    </View>
                  </View> */}

                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ width: '50%', justifyContent: 'center' }}>
                      <Text style={styles.itemName}>Weight:-</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                      <TextInput
                        style={styles.TextInputText}
                        autoCorrect={false}
                        placeholder='0'
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                        blurOnSubmit={true}
                        multiline={false}
                        maxLength={5}
                        keyboardType="phone-pad"
                        mode="outlined"
                        value={weight}
                        onChangeText={(value) =>
                          // onTipEdit(value, index)
                          setWeight(value)
                        }

                      />

                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ width: '50%', justifyContent: 'center' }}>
                      <Text style={styles.itemName}>Rest Time:-</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                      <TextInput
                        style={styles.TextInputText}
                        autoCorrect={false}
                        placeholder='0'
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                        blurOnSubmit={true}
                        multiline={false}
                        maxLength={5}
                        keyboardType="phone-pad"
                        mode="outlined"
                        value={restingTime}
                        onChangeText={(value) =>
                          // onTipEdit(value, index)
                          setRestingTime(value)
                        }

                      />

                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ width: '50%', justifyContent: 'center' }}>
                      <Text style={styles.itemName}>Start Time:-</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                        <TouchableOpacity
                        onPress={() => showTimepicker(true)}
                      >
                      <Text
                        style={{padding:6}}
                        >
                        {startTime}
                      </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ width: '50%', justifyContent: 'center' }}>
                      <Text style={styles.itemName}>End Time:-</Text>
                    </View>
                    <View style={styles.textInputContainer}>

                    <TouchableOpacity
                        onPress={() => showTimepicker(false)}
                      >
                      <Text
                        style={{padding:6}}
                        >
                        {endTime}
                      </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ width: '50%', justifyContent: 'center' }}>
                      <Text style={styles.itemName}>Duration:-</Text>
                    </View>
                    <View style={[styles.textInputContainer, { width: '40%' }]}>
                      
                    <Text
                        style={[styles.TextInputText,{paddingTop:7,paddingLeft:5,paddingBottom:7}]}>
                       { (startTime!=='00:00'&&endTime!=='00:00')
             ? diffTime(startTime,endTime):'0 Min'}
                      </Text>
                    </View>
                  </View>

                  {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={false}
                        display="default"
                        onChange={onChange}
                      />
                    )}
                </View>
               { edit ?

<TouchableOpacity onPress={() =>onUpdateWorkout(listId)}
style={{ backgroundColor: COLORS.PRIMARY,width:'100%',
borderBottomEndRadius:10,
borderBottomStartRadius:10,
marginTop:10}}>
<Text style={{ color: COLORS.WHITE,fontSize:FONT.SIZE.LARGE,textAlign:'center',padding:6}}>Update</Text>
</TouchableOpacity>:
                <TouchableOpacity onPress={() =>onAddWorkout()}
          style={{ backgroundColor: COLORS.PRIMARY,width:'100%',
          borderBottomEndRadius:10,
          borderBottomStartRadius:10,
          marginTop:10}}>
          <Text style={{ color: COLORS.WHITE,fontSize:FONT.SIZE.LARGE,textAlign:'center',padding:6}}>ADD</Text>
        </TouchableOpacity>}

              </View>




            </Modal>


         
          </View>
        )
        }
      </>
    {/* </ScrollView > */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  modalView: {
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 15,
    borderTopRightRadius: 15
  },
  TextInputText: {
    flex: 1,
    fontFamily: FONT.FAMILY.REGULAR,
    color: COLORS.BLACK,
    marginTop: 0,
    textAlignVertical: "top",
    padding: 5
    // marginLeft:10
  },
  textInputContainer: {
    //  paddingTop: 10,
    borderRadius: 10,

    // marginBottom: 20,
    width: '40%',
    // padding:-10,
    backgroundColor: "white",
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.44,
    shadowRadius: 1.32,
    elevation: 0,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    flexDirection: 'row'
  },
  itemName: {
    textAlignVertical: 'center',
    fontFamily: FONT.FAMILY.SEMI_BOLD,
    fontSize: FONT.SIZE.MEDIUM
  }
});

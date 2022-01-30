import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  NativeEventEmitter, 
  Platform
} from 'react-native';
import {COLORS, HEIGHT, WIDTH, GAP, FONT} from '../../Utils/constants';
import Dialog from '../common/Dialog';
// import Pedometer, {
//   PedometerInterface,
// } from '@t2tx/react-native-universal-pedometer';
import Toast from 'react-native-simple-toast';
import Network from '../../Services/Network';
import {getToken, getUserId,getGoal} from '../../Utils/Preference';
import {ScrollView} from 'react-native-gesture-handler';
// import Fitness from '@ovalmoney/react-native-fitness';
import ProgressCircle from 'react-native-progress-circle';
import Loader from '../../Components/Common/Loader';
// import Fitness from '@ovalmoney/react-native-fitness';
import RNWalkCounter from 'react-native-walk-counter';


export default function TrackExercise(props) {
  const currentDate =
    new Date().getFullYear() +
    '-' +
    (new Date().getMonth() + 1) +
    '-' +
    new Date().getDate();
  useEffect(function () {
    // const permissions = [
    //   { kind: Fitness.PermissionKinds.Steps, access: Fitness.PermissionAccesses.Write },
    //   { kind: Fitness.PermissionKinds.Steps, access: Fitness.PermissionAccesses.Read },

    // ];

    // console.log('permissions');
    // console.log('jj',permissions);
  
    // Fitness.requestPermissions(permissions)
    //   .then((allowed) => {
    //     console.log('pp',permissions);
    //     // Do something
    //     console.log('Requesting peermissions');
    //     console.log(allowed);
    //     Fitness.subscribeToSteps()
    //       .then((response) => {
    //         console.log('subscribed?');
    //         console.log('ss',response);
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //         // Do something
    //         console.log('Subscribed to steps not ok');
    //       });
    //   })
    //   .catch((error) => {
    //     // Do something
    //     console.log('Permissions not ok');
    //   });
  
    token();
    lisener();
    // startStepCounter()
    
  }, []);

  const startStepCounter=()=>{
    setIsTrackingStart(true);
    if(Platform.OS==='android'){
    const WalkEvent = new NativeEventEmitter(RNWalkCounter);

    WalkEvent.addListener('onStepRunning', (event) => {      
      console.log(event.steps) 
      setNumberOfSteps(event.steps)     
      //  alert(numberOfSteps)
    })
    RNWalkCounter.RNWalkCounter.startCounter()
  }else{
    checkStepCountAvailable()
  }
  }

  const stopStepCounter=()=>{
    setIsTrackingStart(false)
    if(Platform.OS==='android'){
    const WalkEvent = new NativeEventEmitter(RNWalkCounter);
    RNWalkCounter.RNWalkCounter.stopCounter()
    WalkEvent.removeListener('onStepRunning')	;
    updateStepCountOnServer()
    }else{
      startSaveDataOnServer()
    }
    // alert(numberOfSteps)
  }
  
  const lisener = () => {
    props.navigation.addListener('focus', async () => {
      token();
    });
  };

  const token = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();
      setUserToken(token);
      setUserId(id);
      getStepWalkList(token);
      // startSaveDataOnServer();
      // alert(JSON.stringify(stepWalkList))

       const Goal=await getGoal();
       const actionType = await getActionType();

setAction(act)
       console.log('g',Goal)
      
     
    } catch (e) {
      console.log('Error', e);
    }
  };

  const data = [{id: '1', Button: '1'}];
  const [userToken, setUserToken] = useState('');
  const [stepWalkList, setStepWalkList] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [userId, setUserId] = useState('');
  const [pedoMeterData, setPedoMeterData] = useState({});
  const [isActivitiesDialog, setIsActivitiesDialog] = useState(false);
  const [isTrackingStart, setIsTrackingStart] = useState(false);
  const [numberOfSteps,setNumberOfSteps]=useState(0);
  const [loading,setLoading]=useState(false);
  const [invalid,setInvalid]=useState(false);
  const [message,setMessage]=useState('')
  const [stepCountPer,setStepCountPer]=useState(0)
  const [distance,setDistance]=useState(0)
  const [action,setAction]=useState('false')

  const [activityName, setActivityName] = useState({
    name: 'Track Name',
  });
  const [exerciseList, setExerciseList] = useState([
    {
      calories: 13.4,
      _id: '5fb3c0bb53d0970900fa5j1g',
      name: 'Run',
    },
    {
      calories: 7.6,
      _id: '5fb3c0bb53d0970900fa5k3x',
      name: 'Walk',
    },
  ]);


  const getExerciseList = (token) => {
    console.warn('/get-run-walk-lis');
    Network('/get-run-walk-list', 'get', '', token)
      .then(function (response) {
        console.log('\n\nwalk List', JSON.stringify(response));
        setExerciseList(response.response_data);
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };


  const startTrackActivity = () => {
    if (activityName.name === 'Track Name') {
      Toast.show('Please Select Track Name');
    } else {
      setIsTrackingStart(true);
      // checkStepCountAvailable();
      startStepCounter()
    }
  };

  const checkStepCountAvailable = () => {
    console.log(userId);
    console.log(userToken);
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
        console.log('PedoMeter ', JSON.stringify(data));

        setPedoMeterData(data);
      },
    );
  };

  const startSaveDataOnServer = () => {
   
    setInterval(async (pedoMeterData) => {
    updateStepCountOnServerIos(pedoMeterData)
    }, 20 * 1000);
  };

  const updateStepCountOnServer = async() => {

    const token=await getToken();
    setIsTrackingStart(false)
    
          let stepCountPer=(numberOfSteps/1000)*100;
          setStepCountPer(stepCountPer);
    
    let km=numberOfSteps/1000;
    setDistance(km)
          const date = new Date();
          // console.log(JSON.stringify(pedoMeterData));
          let formData = new FormData();
          formData.append('exercise_name', 'Walk');
          formData.append('user_id', userId);
          formData.append('time', date.toString());
          formData.append('duration', '30 Min');
          // formData.append('calories_burned', '228');
          formData.append('steps', numberOfSteps);
          formData.append('km', numberOfSteps/1000);
     
          setLoading(true)
          Network('/add-walking-steps', 'post', formData, userToken)
            .then((response) => {
              console.log('Add Step Count', JSON.stringify(response));
          setLoading(false)
    
              Toast.show(response.response_message);
              getStepWalkList(token)
            })
            .catch(function (error) {
              console.log(JSON.stringify(error));
            });
    
  };



  const updateStepCountOnServerIos = (pedoMeterData) => {
  
     const date = new Date();
      console.log(JSON.stringify(pedoMeterData));
      let formData = new FormData();
      formData.append('exercise_name','Walk');
      formData.append('user_id', userId);
      formData.append('time', date.toString());
      formData.append('duration', '30 Min');
      formData.append('calories_burned', '228');
      formData.append('steps', pedoMeterData.numberOfSteps);
      formData.append('km', pedoMeterDat.distance);

      Network('/add-walking-steps', 'post', formData, userToken)
        .then((response) => {
          console.log('Add Step Count', JSON.stringify(response));
          Toast.show(response.response_message);
        })
        .catch(function (error) {
          console.log(JSON.stringify(error));
        });
    
  };

  const getStepWalkList = (token) => {
    setLoading(true)

    Network(
      '/list-walking-steps?date=' + currentDate + '&user_id=' + userId,
      'get',
      '',
      token,
    )
      .then(function (response) {
if(response.response_data.docs!=''){
       
        setStepWalkList(response.response_data.docs);
        console.log('stepwalklist', JSON.stringify(stepWalkList));
      setLoading(false)
      setInvalid(false);
      setMessage('')
        getStepCount(response.response_data.docs);
}else{
  setInvalid(true);
  setLoading(false)
  setMessage('No reccord available.')
  
}
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };

  const getStepCount = (list) => {
    var count = 0;
    for (var i = 0; i < list.length; i++) {
      count = count + list[i].steps;
    }
    setStepCount(count);
  };

  return (
    <ScrollView style={{flex: 1}}>
      <View style={{flex: 1}}>
      <Loader loading={loading} />

      
          <View style={{alignSelf:'center',marginTop:20}}>
              <ProgressCircle
            percent={stepCountPer}
            radius={60}
            borderWidth={15}
            color={COLORS.BLUE}
            shadowColor={COLORS.FAINTGRAY}
            bgColor="#fff"
        >
            <Text style={{ fontSize: 18 }}>{numberOfSteps} step</Text>
        </ProgressCircle>
        </View> 
        
        {console.log('isTrackingStart', isTrackingStart)}

        {isTrackingStart == false && (
          <TouchableOpacity activeOpacity={0.5} onPress={startStepCounter}>
            <View
              style={{
                width: '30%',
                padding: HEIGHT * 0.02,
                backgroundColor: COLORS.RED,
                borderRadius: 25,
                marginVertical: GAP.SMALL + 6,
                marginTop: 30,
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
                Start
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {isTrackingStart == true && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => stopStepCounter()}>
            <View
              style={{
                width: '30%',
                padding: HEIGHT * 0.02,
                backgroundColor: COLORS.RED,
                borderRadius: 25,
                marginVertical: GAP.SMALL + 6,
                marginTop: 30,
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
                Stop
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View
          style={{
            width: '90%',
            elevation: 4,
            borderRadius: 6,
            marginHorizontal: 20,
            marginVertical: 10,
            backgroundColor: 'white',
            marginTop: 20,
          }}>
             {/* {invalid &&
           <Text style={{textAlign:'center',
                  color:COLORS.RED,
                  fontFamily:FONT.FAMILY.REGULAR,
                  margin:10}}>
                    {message}
                    </Text>} */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#D8EEFF',
              paddingVertical: 10,
              paddingHorizontal: 30,
            }}>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', color: COLORS.BLACK}}>
              Kilometre
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.BLACK,
                marginEnd: 30,
              }}>
              Steps
            </Text>
            {/* <Text
              style={{fontSize: 16, fontWeight: 'bold', color: COLORS.BLACK}}>
              Calories
            </Text> */}
          </View>
          <View>
            {!invalid ?
            <FlatList
              data={stepWalkList}
              keyExtractor={(item) => item.id}
              renderItem={({item, index}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    paddingHorizontal: 40,
                  }}>
                  <Text style={{fontSize: 12, color: COLORS.GRAY}}>
                    {item.km}
                  </Text>
                  <Text
                    style={{fontSize: 12, color: COLORS.GRAY, marginEnd: 40}}>
                    {item.steps}
                  </Text>
                  {/* <Text
                    style={{fontSize: 12, color: COLORS.GRAY, marginEnd: 10}}>
                    {item.calories_burned}
                  </Text> */}
                </View>
              )}
            />:
            <Text style={{
              textAlign: 'center',
              color: COLORS.RED,
              fontFamily: FONT.FAMILY.REGULAR,
              margin: 10
            }}>
              {message}
              </Text>
            }
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// import React from 'react';
// import {View, Text, StyleSheet, Button} from 'react-native';

// import Pedometer, {
//   PedometerInterface ,
// } from '@t2tx/react-native-universal-pedometer';

// // interface PedoResult : PedometerInterface | string | null;

// export class TrackExercise extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       data: {},
//       error: 'none',
//     };
//   }

//   check = () => {
//     Pedometer.isStepCountingAvailable((error, result) => {
//       console.log(error, result);
//       this.setState({
//         data: {result: result + ''},
//         error,
//       });
//     });
//   };

//   start = () => {
//     Pedometer.startPedometerUpdatesFromDate(
//       new Date().setHours(0, 0, 0, 0),
//       data => {
//         this.setState({
//           data: data || {},
//           error: '-',
//         });
//       },
//     );
//   };

//   stop = () => {
//     Pedometer.stopPedometerUpdates();
//     this.setState({
//       data: {state: 'stoped'},
//       error: '-',
//     });
//   };

//   load = () => {
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);
//     const end = new Date();
//   //  const data= PedometerInterface | null;
//     Pedometer.queryPedometerDataBetweenDates(
//       start.getTime(),
//       end.getTime(),
//       (error, data=PedometerInterface | null) => {
//         console.log(error);
//         console.log(data);
//         this.setState({
//           data: data || {},
//           error,
//         });
//       },
//     );
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <View style={styles.row}>
//           <View style={styles.rowItem}>
//             <Button title=" ? " onPress={this.check} />
//           </View>
//           <View style={styles.rowItem}>
//             <Button title=" ▶︎ " onPress={this.start} />
//           </View>
//           <View style={styles.rowItem}>
//             <Button title=" ■ " onPress={this.stop} />
//           </View>
//           <View style={styles.rowItem}>
//             <Button title=" ◎ " onPress={this.load} />
//           </View>
//         </View>
//         <View style={[styles.row, styles.rowItem]}>
//           <Text>ERROR: {this.state.error}</Text>
//         </View>
//         <View style={styles.rowItem}>
//           <Text>DATA:</Text>
//         </View>
//         {Object.keys(this.state.data).map(key => {
//           return (
//             <View key={key} style={styles.detailItem}>
//               <Text>
//                 {key}: {this.state.data[key]}
//               </Text>
//             </View>
//           );
//         })}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   row: {
//     flexDirection: 'row',
//   },
//   rowItem: {
//     margin: 3,
//   },
//   detailItem: {
//     marginTop: 5,
//     marginLeft: 15,
//   },
// });

// export default TrackExercise;

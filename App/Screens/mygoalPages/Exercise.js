import React, {useState, useEffect} from 'react';
import {View, Text, Image, Dimensions, FlatList, Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {COLORS, HEIGHT, WIDTH,FONT} from '../../Utils/constants';
import {getToken, getUserId, setUserId,getUserType} from '../../Utils/Preference';
import Network from '../../Services/Network';
import Loader from '../../Components/Common/Loader';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Exercise(props) {
  const currentDate =
    new Date().getFullYear() +
    '-' +
    (new Date().getMonth() + 1) +
    '-' +
    new Date().getDate();
  useEffect(function () {
    token();
  }, []);

  const lisener = () => {
    props.navigation.addListener('focus', async () => {
      token();
    });
  };

  const token = async () => {
    // alert(JSON.stringify(props))
    try {
      const token = await getToken();
      const id = await getUserId();
      const userType=await getUserType();

    
      setAuthToken(token);
      setUserId(id);
      getGoalList(token, id);
      getCurrentDay();
      getUserExerciseList(token, id);
      setUserType(userType)

    
      console.log('nnn',userExerciseList)
      lisener();
    } catch (e) {
      console.log(e);
    }
  };
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [goalList, setgoalList] = useState([]);
  const [currentDay, setCurrentDay] = useState('');
  const [userExerciseList, setUserExerciseList] = useState([]);
  const [totalCalories, setTotalCalories] = useState('0');
  const [totalHours, setTotalHours] = useState('0');
  const [userType, setUserType] = useState('');
  const [message, setMessage] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);



  const getGoalList = (token, id) => {
    const userID= userType==='user'?id:props.userDetailsId
    const endUrl = '/list-goal?' + 'date=' + currentDate + '&user_id=' + userID;
    Network(endUrl, 'get', '', token)
      .then(function (response) {

        setgoalList(response.response_data.docs);
        console.log(
          'goallist Excersize',
          JSON.stringify(response.response_data.docs),
        );
      })
      .catch(function (error) {
        console.log('Error ', JSON.stringify(error));
      });
  };

  const getCount = (list) => {
    var count = 0;
    var totalTime = 0;
    for (var i = 0; i < list.length; i++) {
      count = count + Number(list[i].calories_burned);
      totalTime = totalTime + Number(list[i].duration.split(' ')[0]);
      console.log(count);
    }
    setTotalCalories(count);
    setTotalHours(totalTime);
  };

  const minToHour = (time) => {
    var num = time;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + ' hour ' + rminutes + ' minute.';
  };

  const getUserExerciseList = async(token,id) => {
    const userType=await getUserType();
    const userID= userType==='user'?id:props.userDetailsId
    setLoading(true);
    Network(
      '/list-user-exercise?user_id=' + userID + '&date=' + currentDate,
      'get',
      '',
      token,
    )
      .then(function (response) {
        setLoading(false);
        if(response.response_data.docs.length!=0){
          setInvalid(false)
          setMessage('')
        setUserExerciseList(response.response_data.docs);
        getCount(response.response_data.docs);

        console.log('userList', JSON.stringify(response));
        }else{
          setInvalid(true)
          setMessage(' Exercise not found.')
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };

  const getTimeFromDateTime = (datetime) => {
    var date = new Date(datetime);
    var minute = date.getUTCMinutes();
    var hour = date.getUTCHours();
    if (minute > 0) return hour + '.' + minute;
    else return hour;
  };

  const getCurrentDay = () => {
    var days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const day = days[new Date().getDay()];
    setCurrentDay(day);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}>
         <Loader loading={loading} />
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
        </View>}
      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: 18,
            color: COLORS.BLACK,
            marginLeft: 30,
          }}>
          {currentDay}
        </Text>

        <View>
          <FlatList
            data={goalList}
            keyExtractor={(item) => item.id}
            renderItem={({item, index}) => (
              <View
                style={{
                  width: windowWidth / 4.6,
                  height: 50,
                  elevation: 4,
                  borderRadius: 6,
                  marginHorizontal: 20,
                  marginTop: 20,
                  marginVertical: 10,
                  backgroundColor: COLORS.WHITE,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: COLORS.GRAY,
                  shadowOffset: {
                    width: 0,
                    height: 1
                  },
                  shadowOpacity: 0.6,
                  shadowRadius: 1.32,
                }}>
                <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                  {item.times} {'\n'}
                  {item.activityName.activity}
                </Text>
              </View>
            )}
            numColumns={3}
          />
        </View>

        {/* <View
          style={{
            width: '90%',
            elevation: 4,
            borderRadius: 6,
            marginHorizontal: 20,
            marginVertical: 10,
            marginTop: 20,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 14,
            }}>
            <Text
              style={{
                fontSize: 18,
                color: COLORS.BLACK,
              }}>
              Today
            </Text>
            <Image
              source={require('../../Assets/Auths/percent.png')}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
            }}>
            <Image
              source={require('../../Assets/Auths/percent.png')}
              style={{
                width: 80,
                height: 80,
                marginStart: 20,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{marginStart: 50}}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  {totalCalories}
                </Text>
                {'\n'}Kcal
              </Text>
            </View>
            <Text style={{marginStart: 10, alignSelf: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                Total Hrs:{' '}
              </Text>
              {minToHour(totalHours)}
            </Text>
          </View>
        </View> */}
        <View
          style={{
            width: '90%',
            elevation: 4,
            borderRadius: 6,
            marginHorizontal: 20,
            marginVertical: 10,
            backgroundColor: 'white',
            marginTop: 20,
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
              Exercise
            </Text>
            {/* <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.BLACK,
                flex: 1,
                textAlign: 'center',
              }}>
              Time
            </Text> */}
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
            {!invalid ?
            <FlatList
              data={userExerciseList}
              keyExtractor={(item) => item.id}
              renderItem={({item, index}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.GRAY,
                      flex: 1,
                      textAlign: 'center',
                    }}>
                    {item.exerciseData.exerciseName}
                  </Text>
                  {/* <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.GRAY,
                      flex: 1,
                      textAlign: 'center',
                    }}>
                    {getTimeFromDateTime(item.time)}
                  </Text> */}
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.GRAY,
                      flex: 1,
                      textAlign: 'center',
                    }}>
                    {item.duration}
                  </Text>
                  {/* <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.GRAY,
                      flex: 1,
                      textAlign: 'center',
                    }}>
                    {item.calories_burned}
                  </Text> */}
                </View>
              )}
            />:
            <Text style={{textAlign:'center',
            color:COLORS.RED,
            fontFamily:FONT.FAMILY.REGULAR,
            margin:10}}>
              {message}
              </Text>}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

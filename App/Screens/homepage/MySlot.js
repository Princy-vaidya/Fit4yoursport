import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, Image, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { HEIGHT, GAP, COLORS, FONT } from '../../Utils/constants';
import { getToken, getUserId, setSessionKey } from '../../Utils/Preference';
import Loader from '../../Components/Common/Loader';
import Header from '../../Utils/Header';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import { TimePickerModal } from 'react-native-paper-dates';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// const leftImage1 = require('../../Assets/Auths/Ellipse.png');
// const centerImage1 = require('../../Assets/Auths/Ellipse.png');

export default function MySlot(props) {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isStartTime, setIsStartTime] = useState(true);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [timeList, setTimeList] = useState([]);
  const [loading,setLoading]=useState(false);
  const [editId,setEditId]=useState('')
  const [edit,setEdit]=useState(false)
  const [message,setMessage]=useState('')
  const [invalid,setInvalid]=useState(false);
  const [visibleTime, setVisibleTime] = useState(false)
  const [visibleEndTime, setVisibleEndTime] = useState(false)


  useEffect(function () {
    token();
  }, []);


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



  const token = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();
      getTrainerSlot(token, id)

    } catch (e) { }
  };

  const getTrainerSlot = (token, id) => {
    setLoading(true)
    Network(`/list-trainer-slot?trainer_id=${id}`, 'get', '', token)
      .then((response) => {
        setLoading(false)
        if (response.response_data.length != 0) {
          setInvalid(false);
          setMessage('');
          setTimeList(response.response_data)
        }else{
          setInvalid(true);
          setMessage('Please add your availibility slot for students');
        }

      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };



  const onEditTime = (item) => {
    setEdit(true)
    setShowModal(true);
    setStartTime(item.start_time)
    setEndTime(item.end_time)
    setEditId(item._id)
    
  }

  const onChange = async (event, selectedDate) => {

    let currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    await setDate(currentDate);
    // alert(date)


    let hour = selectedDate.getHours();
    let TimeType = '';

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



    let fullTime = hour.toString()  + ':' + minutes.toString()  + TimeType.toString();
    console.log('full', fullTime)
    // setStartTime(fullTime) 

    if (isStartTime) {

      // setStartTime(getTimeFromDateTime(currentDate));
      setStartTime(fullTime)

    } else {
      // setEndTime(getTimeFromDateTime(currentDate));
      setEndTime(fullTime)
    }

  };

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


  const onAddTime = async () => {
    setEdit(false)
    setStartTime('00:00');
    setEndTime('00:00')
    const token = await getToken();
    const id = await getUserId();

    if (startTime== '00:00') {
      Toast.show('Start time name can not be 00:00.');
    }
    else if (endTime == '00:00') {
      Toast.show('End time url can not be 00:00.');
    } else {
      setLoading(true);
      // const videoUrl=url.substring(32);
      let formData = new FormData();
      formData.append('trainer_id', id);
      formData.append('start_time', startTime);
      formData.append('end_time', endTime);
      
      console.log('hhh',formData)
      Network('/add-edit-slot', 'post', formData, token)
        .then((res) => {
          setLoading(false);

          if (res.response_code === 2000) {
            Toast.show(res.response_message);
            getTrainerSlot(token,id)

          } else if (res.response_code === 5010) {

            Toast.show(res.response_message);
          } else {
            Toast.show(res.response_message);
          }
        })

        .catch((error) => {
          // setLoading(false);
          Toast.show(res.response_message);
        });
    }
    setShowModal(false);
    setStartTime('00:00');
    setEndTime('00:00')
  }


  const onUpdateTime = async (editId) => {
    const token = await getToken();
    const id = await getUserId();

    
      setLoading(true);
      // const videoUrl=url.substring(32);
      let formData = new FormData();
     
      formData.append('start_time', startTime);
      formData.append('end_time', endTime);
      formData.append('_id', editId);
      
      console.log('hhh',formData)
      Network('/add-edit-slot', 'post', formData, token)
        .then((res) => {
          setLoading(false);

          if (res.response_code === 2000) {
            Toast.show(res.response_message);
            getTrainerSlot(token,id)

          } else if (res.response_code === 5010) {

            Toast.show(res.response_message);
          } else {
            Toast.show(res.response_message);
          }
        })

        .catch((error) => {
          // setLoading(false);
          Toast.show(res.response_message);
        });
 setShowModal(false)
 setEdit(false);
 setStartTime('00:00');
    setEndTime('00:00')
  }

  const returnSlotList = (item, index) => {
    return (
      <View style={{
        backgroundColor: COLORS.WHITE, margin: 7, alignItems: 'center',

        flexDirection: 'row',
        // borderColor: COLORS.WHITE,
        shadowColor: COLORS.GRAY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        zIndex: 2,
        borderColor: COLORS.GRAY,
        alignSelf: 'center',
        justifyContent: 'space-between',
        width: '90%',
        padding: 5,
        borderWidth: 0.5
      }}>

        <View style={{ width: '60%', flexDirection: 'row' }}>
          <View style={{ borderRightWidth: 0.5 }}>
            <Text style={{ padding: 10, fontSize: FONT.SIZE.MEDIUM }}>Slot {index + 1}</Text>
          </View>
          <Text style={{ padding: 10, fontSize: FONT.SIZE.MEDIUM }}>{item.start_time} - {item.end_time}</Text>
        </View>
        <TouchableOpacity 
        style={{ paddingLeft: 10, 
          paddingRight: 10, 
          backgroundColor: COLORS.PRIMARY,
           padding: 5, width: '20%',
            borderRadius: 5 }}
            onPress={()=>onEditTime(item)}>
          <Text style={styles.textSmall}>Edit</Text>
        </TouchableOpacity>
        {/* <View style={{ paddingLeft: 10, paddingRight: 10, backgroundColor: COLORS.PRIMARY, padding: 5, width: '22%', borderRadius: 5 }}>
          <Text style={styles.textSmall}>Delete</Text>
        </View> */}
      </View>
    )
  }


  const onBckdrop =()=>{
    setShowModal(false)
 setEdit(false);
 setStartTime('00:00');
    setEndTime('00:00')
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white'
      }}>
      <Header
        navigation={props.navigation}
        title='My Slot'
        type='back'
      />
      <Loader loading={loading}/>
      {invalid &&
      <Text style={{
        textAlign: 'center',
        color: COLORS.RED,
        fontFamily: FONT.FAMILY.REGULAR,
        margin: 10
      }}>
        {message}
    </Text>}
      <ScrollView style={{}}>


        <View style={{ margin: 10,marginBottom:60 }}>


          <FlatList
            data={timeList}
            keyExtractor={(item, index) => index.toString()}
            horizontal={false}
            renderItem={({ item, index }) => returnSlotList(item, index)} />


        </View>
       
      </ScrollView>

      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={styles.addButton}>
        <Image source={require('../../Assets/Auths/ADD.png')}
          style={styles.addImage} />
      </TouchableOpacity>

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
          <View style={{ backgroundColor: COLORS.PRIMARY, borderTopStartRadius: 15, borderTopEndRadius: 15, padding: 3 }}>
            <Text style={styles.whiteText}>Add Slot</Text>
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
                End time
          </Text>

            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 10,
                  justifyContent: 'space-around'
                }}>

                <Text
                  style={[{
                    fontSize: 14,

                    textAlign: 'center',
                  }, startTime === '00:00' ? { color: COLORS.GRAY } : { color: COLORS.BLACK }]}
                  onPress={() => setVisibleTime(true)}>
                  {startTime}
                </Text>
                <Text
                  style={[{
                    fontSize: 14,

                    textAlign: 'center',
                  }, endTime === '00:00' ? { color: COLORS.GRAY } : { color: COLORS.BLACK }]}
                  onPress={() => setVisibleEndTime(true)}>
                  {endTime}
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

         { 
         edit===true?
         <TouchableOpacity style={styles.addTextView}
           onPress={()=>onUpdateTime(editId)}
          >
            <Text style={styles.whiteText}>Update</Text>
          </TouchableOpacity>:
         <TouchableOpacity style={styles.addTextView}
           onPress={onAddTime}
          >
            <Text style={styles.whiteText}>Add</Text>
          </TouchableOpacity>
          }
        </View>

      </Modal>


      
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  addButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0,

  },
  addImage: {
    alignSelf: 'flex-end',
                    margin: 15,
                    width: 55,
                    height: 55
  },
  modalView: {
    backgroundColor: 'white',
    width: '70%',
    alignSelf: 'center',
    borderRadius: 15,
    borderTopRightRadius: 15
  },
  whiteText: {
    fontSize: FONT.SIZE.MEDIUM,
    textAlign: 'center',
    color: 'white',
    fontFamily: FONT.FAMILY.SEMI_BOLD,
    padding: 7
  },
  TextInputText: {
    marginLeft: 5,
    borderBottomWidth: 2,
    paddingBottom: 5,
    fontSize: FONT.SIZE.SMALL,
    borderBottomColor: COLORS.LIGHTGRAY,
    width: '95%',
    fontFamily: FONT.FAMILY.MEDIUM
  },
  youTubeTextView: {
    backgroundColor: COLORS.WHITE,
    borderTopStartRadius: 15,
    borderTopRightRadius: 15
  },
  addTextView: {
    backgroundColor: COLORS.PRIMARY,
    marginTop: 20,
    marginHorizontal: 45,
    borderRadius: 10,
    padding: 2,
    marginBottom: 15
  },
  addVideoText: {
    color: COLORS.BLACK,
    marginBottom: -15,
    textAlign: 'left',
    marginTop: 10
  },
  textSmall: {
    textAlign: 'center',
    color: COLORS.WHITE,
    fontSize: FONT.SIZE.SMALL,
    fontFamily: FONT.FAMILY.SEMI_BOLD
  }
});

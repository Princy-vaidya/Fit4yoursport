import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text, SafeAreaView, StyleSheet, ScrollView, TextInput, FlatList } from 'react-native'
import { COLORS, HEIGHT, WIDTH, FONT } from './constants';
import Header from '../Utils/Header';
import { Calendar } from 'react-native-calendars';
import Moment from 'moment';
import Network from '../Services/Network';
import Modal from 'react-native-modal';
import { getUserId, getToken, getUserType } from '../Utils/Preference'
import Toast from 'react-native-simple-toast';
import Loader from '../Components/Common/Loader';


function Notes({ navigation, route }) {

  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(Moment());
  const [markDates, setMarkDates] = useState({});
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [dates, setDates] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteValue, setNoteValue] = useState('');
  const [loading, setLoading] = useState(false)


  useEffect(function () {
   const noteshow=navigation.addListener('focus',()=>{
    getNotes(selectedDate)
    getMarkerDate(); 
    getDetails(selectedDate);

   })
   return noteshow;
    
  }, [navigation]);

  const getDetails = async (selectedDate) => {
    const userType = await getUserType();
    if (userType === 'trainer') {
      getNotes(selectedDate)
      getMarkerDate(); 
    }
    else{
      getUserNotes(selectedDate);
      getUserMarkerDate();
    }
  }


const  getMarkerDate=async()=>{
    const id = await getUserId();
    const token = await getToken();
    // alert(route.params.userId)
    console.log('id...',route.params.userId)
   
    setLoading(true)
    Network(`/list-calendar-marker?` + `trainer_id=${id}&user_id=${route.params.userId}`, 'get', '', token)
      .then(async function (data) {

      let dates = data.response_data;
      let markedDates = {};
    for (let i = 0; i < dates.length; i++) {
      markedDates[dates[i]] = { startingDay: true, color: COLORS.PRIMARY, endingDay: true, textColor: 'white' }
    }
    setMarkedDates(markedDates)
    setDates(dates) ;
   setLoading(false);

 })
      .catch(function (error) {
        console.log(JSON.stringify(error));
        // alert(error)
      });
  }

  const  getUserMarkerDate=async()=>{
    const id = await getUserId();
    const token = await getToken();
   
    setLoading(true)
    Network(`/list-user-calendar-marker?` + `user_id=${id}`, 'get', '', token)
      .then(async function (data) {

        let dates = data.response_data;
        let markedDates = {};
      for (let i = 0; i < dates.length; i++) {
        markedDates[dates[i]] = { startingDay: true, color: COLORS.PRIMARY, endingDay: true, textColor: 'white' }
      }
      setMarkedDates(markedDates)
      setDates(dates) ;
       
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
        // alert(error)
      });
  }

  


  const getNotes = async (selectedDate) => {
    const id = await getUserId();
    const token = await getToken();
    setLoading(true)
    Network(`/get-note-by-date?` + `trainer_id=${id}&user_id=${route.params.userId}&date=${selectedDate}`, 'get', '', token)
      .then(async function (data) {

        let newNotes = data.response_data;
        await setNotes(newNotes)
        setLoading(false);

      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  }

  const getUserNotes = async (selectedDate) => {
    const id = await getUserId();
    const token = await getToken();
    setLoading(true)
    Network(`/get-user-note?` + `&user_id=${id}&date=${selectedDate}`, 'get', '', token)
      .then(async function (data) {

        let newNotes = data.response_data;
        await setNotes(newNotes)
        setLoading(false);

      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  }

  const returnNote = (item, index) => {
    console.log('item', item)
    return (
      <View>
        <Text style={styles.noteText}>
          {item.note}
        </Text>
      </View>
    );
  };


  const getSelectedDayEvents = async (date) => {
      
    let markedDates = {};
    // const  dates = ['2021-01-21', '2021-01-22', '2021-01-19', '2021-02-09']
    if(dates.length!=0){
    for (let i = 0; i <  dates.length; i++) {
      markedDates[ dates[i]] = { startingDay: true, color: COLORS.PRIMARY, endingDay: true, textColor: 'white' }
      if(dates[i]!==date){
        markedDates[date]={ startingDay: true, color: '#D8EEFF', endingDay: true, textColor: COLORS.BLUE }
      }
    }
  }else{
    markedDates[date]={ startingDay: true, color:'#D8EEFF', endingDay: true, textColor:COLORS.BLUE  }
  }
    
    setMarkedDates(markedDates)
    setSelectedDate(date);
    setMarkDates(markDates);

    let newDate = dates.filter((item) => item === date);

    console.log('dddd', newDate)
    const userType = await getUserType()

    if (userType === 'trainer' && date !== newDate[0]) {
      setShowNote(true)
      setNotes([])
    } else {
      getDetails(date);
    }
 };


  const onAddNote = async () => {

    if (note == '') {
      Toast.show('Note can not be empty.');
    }
    else {
      const id = await getUserId()
      const token = await getToken()
      const requestBody = {
        trainer_id: id,
        user_id: route.params.userId,
        note: note,
        date: Moment(selectedDate).format('YYYY-MM-DD')
      };
      console.log('req', requestBody)
      Network('/add-note', 'post', requestBody, token)
        .then((res) => {

          if (res.response_code === 2000) {
            Toast.show(res.response_message);
            getDetails(selectedDate)
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
    setNote('');
    setShowNote(false)
  }

  const currentYear = Moment().format('YYYY')
  const minDate = currentYear -1+ '-01-01'
  const maxDate = currentYear + '-12-31'

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Header
        title='Notes'
        type='back'
        navigation={navigation}
        onPress={navigation} />
      <Loader loading={loading} />

      <Modal transparent={true}
        visible={showNote}
        onBackdropPress={() => setShowNote(false)}
        style={{
          flex: 1,
          justifyContent: 'center',
          width: '100%',
          alignSelf: 'center',
          margin: -10,
          backgroundColor: '#000000aa',
        }}>
        <View style={styles.modalView}>
          <View style={styles.addNoteView}>
            <Text style={styles.whiteText}>Add Note </Text>
          </View>
          <View style={styles.youTubeTextView}>
            <Text style={[styles.whiteText, styles.addVideoText]}>
              {Moment(selectedDate).format('DD MMM YYYY')}
            </Text>
          </View>


          <View style={[styles.textInputContainer, styles.typeView]}>
            <TextInput
              style={[styles.textInput, { marginLeft: 10 }]}
              placeholder='Type here ...'
              placeholderTextColor="grey"
              autoCorrect={false}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              blurOnSubmit={true}
              multiline={true}
              numberOfLines={5}
              value={note}
              onChangeText={input => {
                setNote(input)
              }}
              keyboardType="default"
              mode="outlined"

            />
          </View>
         <TouchableOpacity style={styles.addTextView}
            onPress={() => onAddNote()}
          >
            <Text style={styles.whiteText}>Add</Text>
          </TouchableOpacity>
        </View>

      </Modal>

      <View>
        <Calendar
          minDate={minDate}
          maxDate={maxDate}
          hideArrows={false}
          enableSwipeMonths={true}

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
            selectedDayBackgroundColor:'#222222',
            selectedDayTextColor: "white",
            // textDayHeaderFontSize: 8
            // 'stylesheet.calendar.header': 
            // {
            header: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: '40%',
              alignItems: 'center',
              backgroundColor:'#D8EEFF'
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
   backgroundColor:'white'
}}>
      <View style={styles.noteView}>
        <View style={{ alignSelf: 'center', backgroundColor: '#D8EEFF', width: '100%', alignItems: 'center' }}>
          <Text style={styles.title}>Note - {Moment(selectedDate).format('DD MMM YYYY')} </Text>
        </View>
        <View>
          {notes.length !== 0 ?
            <FlatList
              data={notes}
              keyExtractor={(item, index) => index.toString()}

              renderItem={({ item, index }) => returnNote(item, index)} /> :
            <Text style={[styles.noteText, { color: COLORS.RED }]}>No note available</Text>}
        </View>
      </View>

</View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  title: {
    fontSize: FONT.SIZE.LARGE,
    fontFamily: FONT.FAMILY.SEMI_BOLD,
    padding: 7
  },
  date: {
    fontSize: FONT.SIZE.MEDIUM,
    fontFamily: FONT.FAMILY.SEMI_BOLD,
    marginTop: -15,
    color: COLORS.GRAY
  },
  textInputContainer: {
    paddingTop: 10,
    width: '100%',
    // height: 70,
    borderRadius: 10,
    // marginBottom: 20,
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
    flexDirection: 'row',
  },

  modalView: {
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 15,
    borderTopRightRadius: 15
  },
  whiteText: {
    fontSize: FONT.SIZE.LARGE,
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
    marginHorizontal: 95,
    borderRadius: 10,
    padding: 2,
    marginBottom: 15
  },
  addVideoText: {
    color: COLORS.BLACK,
    textAlign: 'center',
    marginTop: 10
  },
  typeView: {
    alignSelf: 'center',

    width: '93%'
  },
  textInput: {
    flex: 1,
    fontFamily: FONT.FAMILY.REGULAR,
    color: COLORS.BLACK,
    marginTop: -10,
    textAlignVertical: "top",

  },

  noteView: {
    backgroundColor: "white",
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.44,
    shadowRadius: 1.32,
    elevation: 1,
    // borderWidth: 1,
    borderColor: COLORS.GRAY,
    width: '100%',
    alignSelf: 'center',
  },
  noteText: {
    fontSize: FONT.SIZE.MEDIUM,
    fontFamily: FONT.FAMILY.REGULAR,
    margin: 10,
    textAlign: 'center'
  },
  addNoteView: {
    backgroundColor: COLORS.PRIMARY,
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    padding: 3
  }

})



export default Notes
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  NativeEventEmitter,
  NativeModules,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import {COLORS, HEIGHT, WIDTH, GAP, FONT} from '../../Utils/constants';
import moment from 'moment';
import {getToken,getUserId} from '../../Utils/Preference';
import Header from '../../Utils/Header';
import Modal from 'react-native-modal';
import Loader from '../../Components/Common/Loader';
import Network from '../../Services/Network'

export default function TrainerDashboard({navigation}) {
const [userList,setUserList]=useState([]);
const [date,setDate]=useState(moment());
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('')
const [invalid, setInvalid] = useState(false)



 useEffect(function () {
   token();
}, []);

const token = async () => {
  try {
      const token = await getToken();
      const id = await getUserId();     
      getUserSlot(token, id)

      console.log(id)
      // alert(id)
      //   getTrainerSlot(token, id)
      // getUserSlot(token, id)

  } catch (e) { }
};


const getUserSlot = (token, id) => {
  setLoading(true)

  Network(`/trainer-appointment-list?trainer_id=${id}&date=${moment(date).format('YYYY-MM-DD')}&limit=100&page=1`, 'get', '', token)
      .then((response) => {
          setLoading(false)

         
          if (response.response_data.docs.length != 0) {
              setInvalid(false);
              setMessage('');
               console.log('timing',JSON.stringify(response.response_data.docs))
       

            let  appoinmentList=[];
              response.response_data.docs.map(item => {

          
                appoinmentList.push({
                  profile:item.userDetails.profile_image,
                  fname:item.userDetails.fname,
                  lname:item.userDetails.lname,
                  date:item.date,
                  appointmentType:item.appointment_type,
                  startTime:item.slotDetails.start_time,
                  endTime:item.slotDetails.end_time,
                  showModal:false,
                  userDetails:item
                })
              })
  
             
              setUserList(appoinmentList)

          } else {
              setInvalid(true);
              setMessage('No one student has taken an appoinment today.');
          }

      })
      .catch(function (error) {
          console.log(JSON.stringify(error));
      });
};

const onCloseModal=(index)=>{
  let List = [...userList];

  List[index].showModal=false;
  setUserList(List)
}

const onOpenModal=(index)=>{
  let List = [...userList];

  List[index].showModal=true;
  setUserList(List)
}

const onCall=(index,item)=>{
  let List = [...userList];

  List[index].showModal=false;
  setUserList(List)
  navigation.navigate('VideoCallTrainer',{userId:item.userDetails.userDetails._id})

}

const onChat=(index,item)=>{
  let List = [...userList];

  List[index].showModal=false;
  setUserList(List)
  navigation.navigate('Chat',{chat:item.userDetails})  
}



  const returnUserList = (item, index) => {
   var startTime = moment(item.startTime, ["h:mm A"]).format("HH:mm")
  var  endTime = moment(item.endTime, ["h:mm A"]).format("HH:mm")
   var  currentTime = moment().format("HH:mm")


    return (
     
      <View
      style={{
        width: '90%',
        height: 100,
        marginHorizontal: 20,
        marginVertical: 10,
        justifyContent: 'center',
        // borderWidth:0.5,
        // borderColor:COLORS.GRAY,
        // borderRadius:10
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Image
          source={(item.profile===null||item.profile===''||item.profile===undefined) ?
            require('../../Assets/Auths/alexaImage.png'):
            {uri:'https://fit4yoursport.dk:1446/'+item.profile}}
          style={{
            width: 80,
            height: 80,
            borderRadius: 100 / 2,
            overflow: 'hidden',
            borderWidth: 2,
          }}
        />
        <View style={{flex: 0.8}}>
          <Text
            style={{
              color: COLORS.BLACK,
              fontWeight: 'bold',
            }}> 
           {item.fname}  {item.lname}
          </Text>
          <Text
            style={{
              color: COLORS.GRAY,
              marginTop: 10,
            }}>
          {moment(item.date).format('YYYY-MM-DD')}
          </Text>
        </View>
        <View
          style={{
            borderRadius: 16,
            justifyContent: 'center',
            borderWidth: 0.5,
            borderColor: COLORS.RED,
            paddingHorizontal: 22,
            paddingVertical: 8,
          }}>
          <TouchableOpacity onPress={() => onOpenModal(index)}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: FONT.SIZE.MEDIUM,
                color: COLORS.RED,
                fontFamily: FONT.FAMILY.REGULAR,
                fontWeight: 'bold',
              }}>
              View
            </Text>
          </TouchableOpacity>
        </View>
      </View>


      <Modal transparent={true}
        visible={item.showModal===true}
        onBackdropPress={() =>onCloseModal(index) }
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
            <Text style={styles.whiteText}>Appointment Detail</Text>
          </View>
          <View style={styles.youTubeTextView}>
            <Text style={[styles.whiteText, styles.addVideoText,{width:'40%'}]}>
              Appointment 
                 </Text>

                 <Text style={[styles.whiteText, styles.addVideoText,{fontFamily:FONT.FAMILY.REGULAR}]}>
              : {item.appointmentType}
                 </Text>
          </View>

          <View style={styles.youTubeTextView}>
            <Text style={[styles.whiteText, styles.addVideoText,{width:'40%'}]}>
             Time
                 </Text>
 
                 <Text style={[styles.whiteText, styles.addVideoText,{fontFamily:FONT.FAMILY.REGULAR}]}>
          : {item.startTime} -   {item.endTime}
                 </Text>
          </View>
        {(currentTime <= startTime ) &&
        <View style={{alignItems:'center',marginTop:30,margin:10,borderWidth:1,borderColor:COLORS.BLUE,padding:10}}>
        <Text style={styles.appointmentText}
        >Your appointment with  
        <Text style={styles.appointmentBoldText}> {item.fname} {item.lname} </Text><Text style={styles.appointmentText}>has been schedule at</Text> <Text style={styles.appointmentBoldText}>{item.startTime} - {item.endTime}</Text><Text style={styles.appointmentText}> .Please, be ready. </Text></Text>
        </View>}

       { (currentTime >= startTime) && (currentTime < endTime) &&
        <View style={{alignItems:'center',marginTop:30,margin:10,borderColor:'green',padding:10,borderWidth:1}}>
        <Text style={styles.appointmentText}>
        Your appointment with
        <Text style={styles.appointmentBoldText}> {item.fname} {item.lname} </Text><Text style={styles.appointmentText}>has been started. </Text>
        {item.appointmentType==='VIDEO' ?
        <TouchableOpacity 
        style={{flexDirection:'row',marginTop:-5,borderBottomWidth:1,borderColor:'green'}}
        onPress={()=>onCall(index,item)}>
          <Text style={[styles.appointmentText,{color:'green'}]}> Please, join here </Text>
          <Image source={require('../../Assets/Auths/video-call.png')} style={{width:20,height:20,marginLeft:5}}/>
        </TouchableOpacity>:
        <TouchableOpacity 
        style={{flexDirection:'row',marginTop:-5,borderBottomWidth:1,borderColor:'green'}}
        onPress={()=>
         onChat(index,item)
        }><Text style={[styles.appointmentText,{color:'green'}]}> Please, join here </Text>
        <Image source={require('../../Assets/Auths/chat.png')} style={{width:20,height:20,marginLeft:5,tintColor:'green'}}/>
      </TouchableOpacity>
         }
        </Text>
        
       
        </View>}

        {(currentTime >= endTime ) &&
        <View style={{alignItems:'center',marginTop:30,margin:10,borderWidth:1,borderColor:COLORS.RED,padding:10}}>
        <Text style={[styles.appointmentText,{color:COLORS.RED}]}
        >Your appointment with  
        <Text style={[styles.appointmentBoldText,{color:COLORS.RED}]}> {item.fname} {item.lname} </Text><Text style={[styles.appointmentText],{color:COLORS.RED}}>has been ended.</Text></Text>
        </View>}

          <TouchableOpacity style={styles.addTextView}
            onPress={()=>onCloseModal(index)}>
            <Text style={styles.whiteText}>OK</Text>
          </TouchableOpacity>
        </View>

      </Modal>

      </View>
    )
       
}


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Header
          navigation={navigation}
          title='Dashboard'
          type='menu'
         
       />

<Loader loading={loading} />

      {/* <View style={{backgroundColor: '#949494', width: '100%', height: 0.5}} /> */}
      <Text
        style={{
          fontSize: 18,
          color: COLORS.BLACK,
          marginTop: 20,
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        Today
      </Text>

     
  {invalid ?
                <Text style={{
                    textAlign: 'center',
                    color: COLORS.RED,
                    fontFamily: FONT.FAMILY.REGULAR,
                    margin: 10
                }}>
                    {message}
                </Text>:
<FlatList
          data={userList}
          keyExtractor={(item, index) => index.toString()}
        
          renderItem={({ item, index }) => returnUserList(item, index)} />}
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
    // marginBottom: 20,

  },
  addImage: {
    alignSelf: 'flex-end',
    margin: 15,
    width: 55,
    height: 55
  },
  modalView: {
    backgroundColor: 'white',
    width: '90%',
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
    
     marginTop:10,
    flexDirection:'row'
  },
  addTextView: {
    backgroundColor: COLORS.PRIMARY,
    marginTop: 20,
    marginHorizontal: 45,
    borderRadius: 10,
    padding: 2,
    marginBottom: 20,
    
  },
  addVideoText: {
    color: COLORS.BLACK,
    marginBottom: -15,
    textAlign: 'left',
    marginTop: 10
  },
  appointmentText:{
    fontSize:16 ,
    fontFamily:FONT.FAMILY.REGULAR,
    color:COLORS.BLUE,
    textAlign:'center'
  },
  appointmentBoldText:{
    fontSize:16 ,
    fontFamily:FONT.FAMILY.BOLD,
    color:COLORS.BLUE,
    textAlign:'center'
  }
});
